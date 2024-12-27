import { database } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
import {
  doc,
  collection,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import {EventSchemaType as EventType} from "@/lib/types";
import { existsInCache, getCache, setCache } from "@/lib/server_utils";
import { error } from "console";

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
                console.log("Transaction completed");
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

export async function makePayment({
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
        process.env.NEXT_PUBLIC_DOMAIN + `/ticket/${ticketData?.ticketID}@${ticketData?.eventID}@${ticketData?.uid}`,
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

  // const ticketeventID = ticketEntry.eventID

  ticketEntry.scans = 0

  return await runTransaction(database, async (transaction) => {
    // transaction.set(
    //   doc(collection(database, "users"), ticketEntry.uid),
    //   { tickets: arrayUnion(ticketEntry) },
    // )

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
    requestedNumber: ticketData.scans,
    ticketTier: ticketData.tier,
    docRef: doc(collection(database, "events"), ticketData.eventID),
  })
    .then(async (updateTicketsQuantityResponse) => {
      if (updateTicketsQuantityResponse.error) {
        return { response: null, error: updateTicketsQuantityResponse.error };
      }

      return await makePayment({ amount, provider, ticketData }).then(
        async (paymentResponse) => {
          if (paymentResponse.error) {
            return { response: null, error: paymentResponse.error };
          }

          return await createTicketEntry(
            ticketData,
            ticketData.uid,
            paymentResponse.response.data.access_code
          ).then(async (createTicketEntryResponse) => {
            if (createTicketEntryResponse.error) {
              await updateTicketsQuantity({
                requestedNumber: -ticketData.scans,
                ticketTier: ticketData.tier,
                docRef: doc(collection(database, "events"), ticketData.eventID),
              });

              return {
                response: null,
                error: createTicketEntryResponse.error,
              };
            } else {
              return { response: JSON.stringify(paymentResponse), error: null };
            }
          });
        }
      );
    })
    .catch((error) => {
      return { response: null, error: error.message };
    });
}

export function completePaymentProcess() {}
