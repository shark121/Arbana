import { NextRequest, NextResponse } from "next/server";
import { runTransaction, collection, doc } from "firebase/firestore";
import { database } from "@/firebase.config";

async function verifyTicket(ticketID: string, eventID: string) {
  return await runTransaction(database, async (transaction) => {
    const ticketRef = doc(collection(database, "bookings"), eventID);
    const ticket = await transaction.get(ticketRef);

    if (!ticket.exists()) {
      return "ticket does not exist";
    }

    const ticketData = ticket.data()[ticketID];

    console.log(ticketData)

    if (ticketData?.scans === 0) {
      return "ticket has already been scanned";
    }

    transaction.set(ticketRef, { [ticketID]: { scans: 0 } }, {merge:true}, );
    return "ticket verified";

  });
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const data = await req.json();
  const { ticketID, eventID } = data;
  console.log(ticketID, eventID);
  const response = await verifyTicket(ticketID, eventID);
  
  return NextResponse.json({response});
}
