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
import {
  getCache,
  setCache,
  existsInCache,
  setMultipleCache,
} from "@/lib/server_utils";


async function getEventsWithoutCache(userID: string) {
  if (!userID) return null;

  const userDocRef = doc(collection(database, "users"), userID);

  const eventsInfo = await getDoc(userDocRef).then(async (doc) => {
    if (doc.exists()) {
      return doc.data().events || [];
    } 
  });

  return eventsInfo ? eventsInfo : null;
}

async function getUserEvents(userID: string) {
  if (!userID) return null;

  const userEvents = userID + "_events";
  const userBookings = userID + "_bookings";
  const userEventsData = await getCache(userEvents);

  console.log(JSON.parse(userEventsData), "userEventsData");

  if (userEventsData) return JSON.parse(userEventsData);

  const userDocRef = doc(collection(database, "users"), userID);

  const eventsInfo = await getDoc(userDocRef).then(async (doc) => {
    if (doc.exists()) {
      if (doc.data()?.events)
        await setMultipleCache([
          { key: userEvents, value: doc.data().events },
          { key: userBookings, value: doc.data().tickets },
        ]);

      return doc.data().events || [];
    } else {
      return null;
    }
  });

  return eventsInfo ? eventsInfo : null;
}

export async function POST(req: NextRequest) {
  const userDetails = await req.json();
  console.log(userDetails, "userID.................");
  
  const userEvents = await getEventsWithoutCache(userDetails.uid);

  // console.log(userEvents,".............");

  return NextResponse.json({
    data: userEvents,
  });
}
