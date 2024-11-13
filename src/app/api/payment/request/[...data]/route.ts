import { NextRequest, NextResponse } from "next/server";
import { generateRandomId } from "@/lib/utils";
import {
  setDoc,
  runTransaction,
  doc,
  collection,
  arrayUnion,
  query,
  getDoc,
} from "firebase/firestore";
import { database } from "@/firebase.config";
import { TicketType } from "@/lib/types";
import { EventType } from "../../../../../../components/ui/eventComponent";
import { existsInCache, getCache, setCache } from "@/lib/server_utils";

async function updateTicketsQuantity({
  requestedNumber,
  ticketTier,
  docRef,
}: {
  requestedNumber: number;
  ticketTier: string;
  docRef: any;
}) {
  return await runTransaction(database, async (transaction) => {
    let response = false;
    console.log("Transaction started");
    await transaction
      .get(docRef)
      .then(async (doc) => {
        if (doc.exists()) {
          const data = doc.data() as EventType;
          const availableSeats = data.availableSeats;

          for (let i = 0; i < availableSeats.length; i++) {
            const currentSeat = availableSeats[i];
            if (
              currentSeat.tier === ticketTier &&
              currentSeat.number >= requestedNumber
            ) {
              currentSeat.number -= requestedNumber;
              transaction.set(docRef, { availableSeats }, { merge: true });
              console.log("Transaction completed");
              response = true;
              // return true;
            }
            if (
              availableSeats[i].tier === ticketTier &&
              availableSeats[i].number < requestedNumber
            ) {
              console.log("Not enough tickets");
            }
          }
        } else {
          console.log("Document does not exist");
          // return false;
        }
      })
      .catch((error) => {
        console.log(error);
        // return false;
      });

    return response;
  });
}

//   await getDoc(docRef).then(async (doc) => {
//     if (doc.exists()) {
//       const data = doc.data() as EventType;
//       const availableSeats = data.availableSeats;
//       let response = true;

//       for (let i = 0; i < availableSeats.length; i++) {
//         const currentSeat = availableSeats[i];
//         if (ticketTier === currentSeat.tier) {
//           currentSeat.number -= requestedNumber;
//           await setDoc(docRef, { availableSeats }, { merge: true });
//           break;
//         }
//       }
//       return NextResponse.json({ response });
//     } else {
//       return NextResponse.json({ response: false });
//     }
//   });
// }

function makePayment() {
  const paymentPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${generateRandomId(10)}`);
    }, 3);
  });

  return paymentPromise;
}

async function createTicketEntry(
  ticketData: Omit<TicketType, "transactionID">,
  userID: string,
  transactionID: string
) {
  // const ticketID = generateRandomId(10);
  console.log("in ticket entry............................................");
  const ticketEntry = {
    ...ticketData,
    transactionID,
  };

  // const ticketeventID = ticketEntry.eventID

  return await runTransaction(database, async (transaction) => {
    transaction.set(
      doc(collection(database, "users"), ticketEntry.uid),
      { tickets: arrayUnion(ticketEntry) },
      { merge: true }
    );

    console.log(ticketEntry, "ticketEntry.............");
    transaction.set(
      doc(collection(database, "bookings"), ticketEntry.eventID),
      { [ticketEntry.ticketID]: ticketEntry },
      { merge: true }
    );

    if (await existsInCache(userID + "_bookings")) {
      console.log("booking data exists in cache");

      let currentCache = await getCache(userID + "_bookings").then((data) => {
        console.log(JSON.parse(data));
        return JSON.parse(data);
      });

      currentCache.push(ticketEntry);

      await setCache(userID + "_bookings", currentCache);
    } else {
      console.log("booking data does not exist in cache");
      await setCache(userID + "_bookings", [ticketEntry]);
    }
  });
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const ticketFormData = await req.formData();

  const ticketData: Omit<TicketType, "transactionID"> = JSON.parse(
    ticketFormData.get("ticket") as string
  );

  const eventDocRef = doc(collection(database, "events"), ticketData.eventID);

  console.log(ticketData, "ticketData");

  return await updateTicketsQuantity({
    requestedNumber: ticketData.scans,
    ticketTier: ticketData.tier,
    docRef: eventDocRef,
  })
    .then(async (res) => {

      if (!res) {
        return NextResponse.json({ response: "false" });
      }


    return await makePayment() 
        .then(async (transactionId) => {
          const transactionAsString = transactionId as string;
         return await createTicketEntry(
            ticketData,
            ticketData.uid,
            transactionAsString
          )
            .catch((error) => {
              console.error("Error creating ticket entry: ", error);

              updateTicketsQuantity({
                requestedNumber: -ticketData.scans,
                ticketTier: ticketData.tier,
                docRef: eventDocRef,
              });
              return NextResponse.json({ response: "false" });
            })
            .then(() => {
              return NextResponse.json({ response: transactionId });
            });
          // return NextResponse.json({ response: "false" });
        })
        .catch(async (error) => {

          console.error("Error making payment: ", error);
          return await updateTicketsQuantity({
            requestedNumber: -ticketData.scans,
            ticketTier: ticketData.tier,
            docRef: eventDocRef,
          });
          // return NextResponse.json({ response: "false" });
        });
    })
    .catch((error) => {
      console.error("Error updating tickets quantity: ", error);
      return NextResponse.json({ response: "false" });
    });


//  console.log(res, "res............");
  //   return await makePayment()
  //     .then(async (transactionId) => {
  //       const transactionAsString = transactionId as string;
  //       await createTicketEntry(
  //         ticketData,
  //         ticketData.uid,
  //         transactionAsString
  //       ).catch((error) => {
  //         console.error("Error adding document: ", error);
  //         updateTicketsQuantity({
  //           requestedNumber: ticketData.scans,
  //           ticketTier: ticketData.tier,
  //           docRef: eventDocRef,
  //         });
  //       });
  //       return NextResponse.json({ response: transactionId });
  //     })
  //     .catch((error) => {
  //       console.error("Error adding document: ", error);
  //       updateTicketsQuantity({
  //         requestedNumber: -ticketData.scans,
  //         ticketTier: ticketData.tier,
  //         docRef: eventDocRef,
  //       });
  //       return NextResponse.json({ response: "false" });
  //     });
  // }
}
