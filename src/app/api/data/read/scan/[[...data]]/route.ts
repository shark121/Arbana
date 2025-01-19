import { NextRequest, NextResponse } from "next/server";
import { runTransaction, collection, doc } from "firebase/firestore";
import { database } from "@/firebase.config";
import { auth } from "@/firebase.config";
import { scanResultType } from "@/lib/types";


async function processTransaction(eventID: string, ticketID: string)  : Promise<scanResultType>{
  try {
    const result = await runTransaction(database, async (transaction) => {
      const eventBookingsRef = doc(collection(database, "bookings"), eventID);

      const ticketBookings = await transaction.get(eventBookingsRef);

      console.log(ticketBookings.data());

      if (!ticketBookings.exists()) {
        console.log("Document does not exist in the database");
        return { scans: null, quantity: null, ticketData: null, err: "Document does not exist in the database"};
      }

      const bookingsData = ticketBookings.data();

      console.log(Object.keys(bookingsData));

      if (Object.keys(bookingsData).includes(ticketID)) {
        console.log(bookingsData, "bookings data");
        const ticketData = bookingsData[ticketID];
        console.log(ticketData, "ticket Data.......................");

        const scans = ticketData.scans;

        if (scans > 0) ticketData["scans"] = scans - 1;

        transaction.set(
          eventBookingsRef,
          { [ticketID]: ticketData },
          { merge: true }
        );

        return { scans, quantity: ticketData.quantity, ticketData, err:null };
      }

      console.log("Ticket ID not found in the bookings data");
      return { scans: null, quantity: null, ticketData: null, err: "Ticket ID not found in the bookings data" };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const data = await req.json();
  const { ticketID, eventID } = data;
  console.log(ticketID, eventID, "ticket ID event ID");
  const response = await processTransaction(eventID, ticketID);

  return NextResponse.json({ data: response});
}
