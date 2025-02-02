import { database } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
import {
  doc,
  collection,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import {functions} from "@/firebase.config"
import { EventSchemaType as EventType } from "@/lib/types";
import {
  setRedisTriggerEvent,
  invokeSubscriberCallback,
  getCache,
} from "@/lib/server_utils";
import {httpsCallable} from "firebase/functions"

/// to future me and anyone supposed to work on this code apart from me..... I am indeed truly sorry,  I was not very wise ...

export async function updateTicketsQuantity({
  requestedNumber,
  ticketTier,
  docRef,
}: {
  requestedNumber: number;
  ticketTier: string;
  docRef: any;
}): Promise<{ error: string | null; data: boolean | null }> {
  return await runTransaction(
    database,
    async (
      transaction
    ): Promise<{ error: string | null; data: boolean | null }> => {
      let response = false;

      console.log("Payment transaction started........");
      return await transaction
        .get(docRef)
        .then(async (doc) => {
          if (doc.exists()) {
            const data = doc.data() as EventType;
            const availableSeats = data.availableSeats;

            for (let i = 0; i < availableSeats.length; i++) {
              const currentSeat = availableSeats[i];
              if (
                currentSeat.tier === ticketTier &&
                currentSeat.quantity >= requestedNumber
              ) {
                currentSeat.quantity -= requestedNumber;
                transaction.set(docRef, { availableSeats }, { merge: true });
                response = true;
              }
              if (
                availableSeats[i].tier === ticketTier &&
                availableSeats[i].quantity < requestedNumber
              ) {
                console.log("Not enough tickets");
                return { error: "Not enough tickets", data: null };
              }
            }
            return { error: null, data: response };
          } else {
            console.log("Document does not exist");
            return { error: "Invalid Ticket Details", data: null };
          }
        })
        .catch((error) => {
          return { error: String(error), data: null };
        });
    }
  ).catch((error) => {
    return { error: String(error), data: null };
  });
}

export async function cancelTransaction(ticketDataJSONString: string) {
  const ticketData = JSON.parse(ticketDataJSONString) as TicketSchemaType;

  console.log(ticketData, "ticketData cancelling transaction");

  await updateTicketsQuantity({
    requestedNumber: -ticketData.quantity,
    ticketTier: ticketData.tier,
    docRef: doc(collection(database, "events"), ticketData.eventID),
  })
    .catch((err) => {
      console.error(err, "error correcting database");
    })
    .then(() => {
      console.log("Database corrected, transaction cancelled");
    });
}

export async function makePaymentRequest({
  amount,
  provider,
  ticketData,
}: {
  amount: number;
  provider: string;
  ticketData?: Omit<TicketSchemaType, "transactionID">;
}): Promise<{ response: any | null; error: string | null }> {
  provider = provider.toLowerCase();
  amount ??= 0;

  return await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
      email: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      currency: "GHS",
      mobile_money: {
        provider: "mtn,vodafone",
      },
      callback_url:
        process.env.NEXT_PUBLIC_DOMAIN +
        `/ticket/${ticketData?.ticketID}@${ticketData?.eventID}@${ticketData?.uid}`,
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      return { response: data, error: null };
    })
    .catch((error) => {
      console.error(error);
      return { response: null, error: String(error) };
    });
}

export async function createTicketEntry(
  ticketData: Omit<TicketSchemaType, "transactionID">,
  userID: string,
  transactionID: string
): Promise<{ data: number; error: string | null }> {
  console.log("in ticket entry............................................");
  const ticketEntry = {
    ...ticketData,
    transactionID,
  };

  console.log(ticketData, transactionID);

  ticketEntry.scans = 0;

  return await runTransaction(database, async (transaction) => {
    console.log(ticketEntry, "ticketEntry.............");

    transaction.set(
      doc(collection(database, "bookings"), ticketEntry.eventID),
      { [ticketEntry.ticketID]: ticketEntry },
      { merge: true }
    );
  })
    .catch((error) => {
      console.error(error, "error in ticket entry");
      return { data: 500, error: String(error) };
    })
    .then(() => {
      return { data: 200, error: null };
    });
}

export async function replenishTickets({
  quantity,
  tier,
  eventID,
}: {
  quantity: number;
  tier: string;
  eventID: string;
}) {
  await updateTicketsQuantity({
    requestedNumber: -quantity,
    ticketTier: tier,
    docRef: doc(collection(database, "events"), eventID),
  }).catch((err) => {
    console.error(err, "error correcting database");

    return {
      response: null,
      error: "Error correcting database",
    };
  });
}

export async function startPaymentProcess({
  amount,
  provider,
  ticketData,
}: {
  amount: number;
  provider: string;
  ticketData: Omit<TicketSchemaType, "transactionID">;
}): Promise<{ response: string | null; error: string | null }> {
  return await updateTicketsQuantity({
    requestedNumber: ticketData.quantity,
    ticketTier: ticketData.tier,
    docRef: doc(collection(database, "events"), ticketData.eventID),
  })
    .then(async (updateTicketsQuantityResponse) => {
      if (updateTicketsQuantityResponse.error) {
        return { response: null, error: updateTicketsQuantityResponse.error };
      }

      return await makePaymentRequest({ amount, provider, ticketData }).then(
        async (paymentRequestResponse) => {
          if (paymentRequestResponse.error) {

            await replenishTickets({
              quantity: ticketData.quantity,
              eventID: ticketData.eventID,
              tier: ticketData.tier,
            });

            return { response: null, error: paymentRequestResponse.error };
          }

          await setRedisTriggerEvent(
            paymentRequestResponse.response.data.reference,
            String(ticketData.scans),
            JSON.stringify(ticketData),
            60 * 60 * 1 // wait for one hour
          );

          await invokeSubscriberCallback((key) => {
            getCache(`${key}_`).then((ticketDataJSONString) => {
              cancelTransaction(ticketDataJSONString);
            });
          });

          return await createTicketEntry(
            ticketData,
            ticketData.uid,
            paymentRequestResponse.response.data.access_code
          )
            .then(async (createTicketEntryResponse) => {
              if (createTicketEntryResponse.error) {

                await replenishTickets({
                  quantity: ticketData.quantity,
                  eventID: ticketData.eventID,
                  tier: ticketData.tier,
                });                 

                return {
                  response: null,
                  error: createTicketEntryResponse.error,
                };
              } else {
                return {
                  response: JSON.stringify(paymentRequestResponse),
                  error: null,
                };
              }
            })
            .catch((err) => {
              console.error(err, "error creating ticket entry");

              return {
                response: null,
                error: "Error Creating Ticket Entry ",
              };
            });
        }
      );
    })
    .catch((error) => {
      console.error(error, "error in payment process");
      return { response: null, error: error.message };
    });
}

export function completePaymentProcess() {}
