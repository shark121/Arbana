import { NextRequest, NextResponse } from "next/server";
import { createTicketEntry } from "../../route.utils";
import {
  setDoc,
  doc,
  collection,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import { database } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
import {
  getCache,
  invokeSubscriberCallback,
  deleteFromCache,
  setCache,
} from "@/lib/server_utils";
import { group } from "console";

const bookingsCollection = collection(database, "bookings");
const userCollection = collection(database, "users");

export async function POST(req: NextRequest) {
  const { reference, eventId, ticketId, trxref, userId } = await req.json();

  await invokeSubscriberCallback((message) => {
    console.log(message, "payment ttl data pos updated...............");
  });

  const ticeketDoc = doc(bookingsCollection, eventId);

  console.log(reference, eventId, "payment response data...............");

  await runTransaction(database, async (transaction) => {
    console.log("Transaction started");
    await transaction
      .get(doc(bookingsCollection, eventId))
      .then(async (document) => {
        if (document.exists()) {
          const data = document.data();

          if (data[ticketId]) {
            data[ticketId].scans = data[ticketId].availableSeats.groupNumber ? data[ticketId].quantity * data[ticketId].groupNumber : data[ticketId].quantity;
            data[ticketId].reference = reference;
            data[ticketId].trxref = trxref;

            console.log("data ", data);

            transaction.set(
              doc(userCollection, userId),
              { tickets: arrayUnion(data[ticketId]) },
              { merge: true }
            );

            console.log("user document found");

            if (userId.indexOf("anon_") === -1) {
              console.log(
                "user is signed in, updating ticket data in cache..."
              );

              const currerntCache = await getCache(userId + "_bookings");
              const currentCacheJSON = JSON.parse(currerntCache) || [];
              currentCacheJSON.push(data[ticketId]);
              setCache(userId + "_bookings", currentCacheJSON);

            }

            transaction.set(ticeketDoc, data, { merge: true });

            console.log("booking document updated");

            await deleteFromCache(reference);
            await deleteFromCache(`${reference}_`).then((res) => {
              console.log("deleted from cache after successful payment");
            });

            return NextResponse.json({ status: 200, err: null });
          } else {
            console.log("Document does not exist");
            return NextResponse.json({
              status: 404,
              err: "Document does not exist",
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        return NextResponse.json({ err: String(error), status: 500 });
      });
  });

  // console.log("transaction did not initiate");

  return NextResponse.json({ status: 200, err: "trasaction did not initiate" });
  // return NextResponse.json({ });
}
