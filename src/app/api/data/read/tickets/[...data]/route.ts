import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/firebase.config";
import {
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import {EventSchemaType as EventType} from "@/lib/types"

async function updateTicketsQuantity({
  requestedNumber,
  ticketTier,
  docRef,
}: {
  requestedNumber: number;
  ticketTier: string;
  docRef: any;
}) {
  let response = false;

  await runTransaction(database, async (transaction) => {
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
              currentSeat.quantity >= requestedNumber
            ) {
              currentSeat.quantity -= requestedNumber;
              transaction.set(docRef, { availableSeats }, { merge: true });
              console.log("Transaction completed");
              response = true

            }
            if (
              availableSeats[i].tier === ticketTier &&
              availableSeats[i].quantity < requestedNumber
            ) {

              console.log("Not enough tickets");
            }
          }
        } else {
          console.log("Document does not exist");
        }
      })
      .catch((error) => {
        console.log(error);
      });


  });

  return response;
}

export async function GET(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const requestedNumber = Number(context.params.data[0]);
  const ticketTier = context.params.data[1];
  const requestedEventID = context.params.data[2];
  const collectionRef = collection(database, "events");
  const docRef = doc(collectionRef, requestedEventID);

 const res  = await updateTicketsQuantity({
    requestedNumber,
    ticketTier,
    docRef,
  }).then((res) => {
    // console.log(res);
    return res;
  }
  ).catch((error) => {
    console.log(error);
    return false
  });

  
 

  return  NextResponse.json({ response: res });
  // return res;
}
