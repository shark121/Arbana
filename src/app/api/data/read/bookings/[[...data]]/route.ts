import { NextRequest, NextResponse } from "next/server";
import { database } from "@/firebase.config";
import { collection, doc, getDoc } from "firebase/firestore";
import { getCache, setCache, setMultipleCache } from "@/lib/server_utils";


async function getUserTickets(userID: string) {
  const userBookings = userID + "_bookings";
  const userEvents = userID + "_events";
  const userDocRef = doc(collection(database, "users"), userID);
  const userBookingsData = await getCache(userBookings) || null;

  if (userBookingsData) {
    return JSON.parse(userBookingsData);
  }

  const userInfo = await getDoc(userDocRef).then(async (doc) => {
    if (doc.exists()) {
      // await setMultipleCache([userEvents, doc.data().events, userBookings, doc.data().tickets] )
      setCache(userBookings, doc.data().tickets);
      
      return doc.data().tickets;
    } else {
      return null;
    }
  });

  return userInfo ? userInfo : null;
}

export async function GET(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const data = context.params.data;
  console.log(data);
  const userID = data[0];

  const userTicktets = await getUserTickets(userID);

  return NextResponse.json({ res: userTicktets });
}

