import { NextRequest, NextResponse } from "next/server";
import {
  runTransaction,
  doc,
  Transaction,
  collection,
  arrayRemove,
  where,
} from "firebase/firestore";
import { database } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
import { getCache, setCache } from "@/lib/server_utils";

async function deleteTicket(ticketData: TicketSchemaType) {
  const ticketDocRef = doc(collection(database, "users"), ticketData.uid);
  const cacheId = `${ticketData.uid}_bookings`;
  const deleteId = ticketData.ticketID;

  await runTransaction(database, async (transaction) => {
    const docSnap = transaction.get(ticketDocRef);
    if ((await docSnap).exists()) {
      transaction.update(ticketDocRef, {
        tickets: arrayRemove(ticketData),
      });

      await getCache(cacheId).then(async (data) => {
        const dataToJson = JSON.parse(data);
        const filteredData = dataToJson.filter(
          (el: TicketSchemaType) => el.ticketID !== deleteId
        );
        await setCache(cacheId, filteredData);
        // console.log(dataToJson);
      });
    }
  });
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const dataJson = data.get("ticketData");
  const ticketData = JSON.parse(dataJson as string);
  await deleteTicket(ticketData);
  // console.log(ticketData);

  return NextResponse.json({ status: 200 });
}
