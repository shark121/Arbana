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
import { existsInCache, getCache, setCache } from "@/lib/server_utils";

const bookingsCollection = collection(database, "bookings");
const userCollection = collection(database, "users");

export async function POST(req: NextRequest) {
  const { reference, eventId, ticketId, trxref, userId } = await req.json();

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
            data[ticketId].scans += 1;
            data[ticketId].reference = reference;
            data[ticketId].trxref = trxref;

            console.log("data ", data);

            transaction.set(
              doc(userCollection, userId),
              { tickets: arrayUnion(data[ticketId]) },
              { merge: true }
            );

            console.log("user document found");

            if (await existsInCache(userId + "_bookings")) {
              console.log("booking data exists in cache");

              let currentCache = await getCache(userId + "_bookings").then(
                (currentCache) => JSON.parse(currentCache)
              );

              currentCache.push(data[ticketId]);

              await setCache(userId + "_bookings", currentCache);
            } else {
              console.log("booking data does not exist in cache");
              await setCache(userId + "_bookings", [data[ticketId]]);
            }

            transaction.set(ticeketDoc, data, { merge: true });

            console.log("booking document updated");

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

  console.log("transaction did not initiate");

  return NextResponse.json({ status: 200, err: "trasaction did not initiate" });
  // return NextResponse.json({ });
}
