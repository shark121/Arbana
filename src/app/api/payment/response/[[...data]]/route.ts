import { NextRequest, NextResponse } from "next/server";
import { createTicketEntry } from "../../route.utils";
import { setDoc, doc, collection } from "firebase/firestore";
import { database } from "@/firebase.config";

const bookingsCollection = collection(database, "bookings");

export async function POST(req: NextRequest) {
  const { reference, eventId, ticketId, trxref } = await req.json();

  const ticeketDoc = doc(bookingsCollection, eventId);

  console.log(reference, eventId, "payment response data...............");

  const { status, err } = await setDoc(
    ticeketDoc,
    { [ticketId]: { scans: 1, reference } },
    { merge: true }
  )
    .then((res) => {
      console.log("event scans successfully updated");
      return { status: 200, err: null };
    })
    .catch((err) => {
      console.log("error updating ticket scans", err);
      return { err: String(err), status: 500 };
    });

  return NextResponse.json({ status, err});
}
