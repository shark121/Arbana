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
import { getCache, setCache, existsInCache } from "@/lib/server_utils";

async function getUserEvents(userID: string) {
  if(!userID) return null;

  const userEvents = userID + "_events";
  const userBookings = userID + "_bookings";

  if (await existsInCache(userEvents)) {
    return getCache(userEvents).then((data) => {
      return JSON.parse(data);
    });
  }

  const userDocRef = doc(collection(database, "users"), userID);

  const eventsInfo = await getDoc(userDocRef).then(async (doc) => {
    if (doc.exists()) {
      await setCache(userEvents, doc.data().events);
      await setCache(userBookings, doc.data().tickets);
      return doc.data().events;
    } else {
      return null;
    }
  }); 

  return eventsInfo ? eventsInfo : null;
}

export async function POST(req: NextRequest) {
  const userID = await req.json();
  console.log(userID, "userID.................");
  const userEvents = await getUserEvents(userID.uid);
  // console.log(userEvents,".............");

  return NextResponse.json({
    data: userEvents,
  });
}
