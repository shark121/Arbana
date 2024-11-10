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

async function updateTicketsQuantity({
  requestedNumber,
  ticketTier,
  docRef,
}: {
  requestedNumber: number;
  ticketTier: string;
  docRef: any;
}) {
  await getDoc(docRef).then(async (doc) => {
    if (doc.exists()) {
      const data = doc.data() as EventType;
      const availableSeats = data.availableSeats;
      let response = true;

      for (let i = 0; i < availableSeats.length; i++) {
        const currentSeat = availableSeats[i];
        if (ticketTier === currentSeat.tier) {
          currentSeat.number -= requestedNumber;
          await setDoc(docRef, { availableSeats }, { merge: true });
          break;
        }
      }
      return NextResponse.json({ response });
    } else {
      return NextResponse.json({ response: false });
    }
  });
}

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
  console.log("in ticket entry............................................")
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
    transaction.set(doc(collection(database, "bookings"), ticketEntry.eventID), {[ticketEntry.ticketID]: ticketEntry}, {merge:true});
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

  return await makePayment()
    .then(async (transactionId) => {
      const transactionAsString = transactionId as string;
      await createTicketEntry(
        ticketData,
        ticketData.uid,
        transactionAsString
      ).catch((error) => {
        console.error("Error adding document: ", error);
        updateTicketsQuantity({
          requestedNumber: ticketData.scans,
          ticketTier: ticketData.tier,
          docRef: eventDocRef,
        });
      });
      return NextResponse.json({ response: transactionId });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      updateTicketsQuantity({
        requestedNumber: ticketData.scans,
        ticketTier: ticketData.tier,
        docRef: eventDocRef,
      });
      return NextResponse.json({ response: "false" });
    });
}
