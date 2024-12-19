import { NextRequest, NextResponse } from "next/server";
import { database } from "@/firebase.config";
import { collection, doc, getDoc } from "firebase/firestore";
import { getCache, setCache, existsInCache } from "@/lib/server_utils";


let hits = 0

async function getUserTickets(userID: string) {
  const userBookings = userID + "_bookings";
  const userEvents = userID + "_events";
  const userDocRef = doc(collection(database, "users"), userID);

  if ((hits > 2) && await existsInCache(userBookings) ) {
    console.log("booking data exists in cache");
    return getCache(userBookings).then((data) => {
      console.log(JSON.parse(data));
      return JSON.parse(data);
    });
  }
    

  const userInfo = await getDoc(userDocRef).then(async (doc) => {
    if (doc.exists()) {
      await setCache(userBookings, doc.data().tickets);
      await setCache(userEvents, doc.data().events)
      console.log(doc.data());
      hits++
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
