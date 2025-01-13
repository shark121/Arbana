import { NextRequest, NextResponse } from "next/server";
import { database, functions } from "@/firebase.config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  loadBundle,
  namedQuery,
  Query,
} from "firebase/firestore";
import { getCache, setCache, existsInCache } from "@/lib/server_utils";
import { httpsCallable } from "firebase/functions";
import { EventSchemaType as EventType } from "@/lib/types";

async function fetchFromBundle() {
  const fetchEventsData = httpsCallable(functions, "createBundle");

  return fetchEventsData().then((result) => {
    const data = result.data as { event: EventType[] };
    return data.event;
  });
}

// async function fetchData(eventId?: string) {

//   try {
//     const data_response = getDoc(doc(collection(database, "events"), eventId));

//     console.log((await data_response).data(), "data_response............");

//     return NextResponse.json({
//       data: (await data_response).data(),
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: 404 });
//   }
// }

// export async function POST(req: NextRequest){
//   const eventID = await req.json();
//   console.log(String(eventID), "eventID.................");
//   return await fetchData(eventID);
// }

async function fetchData(eventId?: string) {
  try {
    if (!eventId) {
      throw new Error("No event ID provided");
    }

    const docRef = doc(collection(database, "events"), eventId);
    const dataResponse = await getDoc(docRef);

    if (!dataResponse.exists()) {
      throw new Error("Document not found");
    }

    return NextResponse.json({
      data: dataResponse.data(),
    });
  } catch (error) {
    console.error("Error fetching data:", String(error));

    return NextResponse.json({ error: String(error), status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { eventID  } = await req.json();

    console.log(`Event ID: ${eventID}`);

    if (!eventID || typeof eventID !== "string") {
      return NextResponse.json({ error: "Invalid event ID", status: 400 });
    }

    console.log(`Event ID: ${eventID}`);

    return await fetchData(eventID);
  } catch (error) {
    console.error("Error in POST request:", String(error));

    return NextResponse.json({ error: String(error), status: 500 });
  }
}
