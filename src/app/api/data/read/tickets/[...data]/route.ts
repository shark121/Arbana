import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/firebase.config";
import { collection, doc, getDoc, increment, setDoc } from "firebase/firestore";
import { EventType } from "../../../../../../../components/ui/eventComponent";

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
        if (
          currentSeat.tier === ticketTier &&
          currentSeat.number >= requestedNumber
        ) {
          currentSeat.number -= requestedNumber;          
          await setDoc(docRef, { availableSeats }, { merge: true });
          break;
        }
        if (
          availableSeats[i].tier === ticketTier &&
          availableSeats[i].number < requestedNumber
        ) {
          response = false;
          break;
        }
      }
      return NextResponse.json({ response });
    } else {
      return NextResponse.json({ response: false });
    }
  });
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

  await updateTicketsQuantity({ requestedNumber, ticketTier, docRef });

  return NextResponse.json({ response: true });
}
