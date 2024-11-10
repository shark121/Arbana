import { NextRequest, NextResponse } from "next/server";
import { database } from "@/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { EventType } from "../../../../../../../components/ui/eventComponent";
import { getCache, setCache, existsInCache } from "@/lib/server_utils";

async function fetchData(eventId?: string) {
  let data: EventType[] = [];
  console.log("fetching data");

  if (await existsInCache("events")) {
    console.log("data exists in cache");
    data = await getCache("events").then((data) => {
      return JSON.parse(data) as EventType[];
    });
    
    if (eventId) {
      const event = data.find((event) => event.eventId === Number(eventId));
      return event;
    }

    return data;
  }

  const response = await getDocs(collection(database, "events"));

  response.forEach((doc) => {
    data.push(doc.data() as EventType);
  });

  await setCache("events", data);

  return data;
}

export async function POST(
  req: NextRequest
) {
  const eventID = await req.json();
  console.log(String(eventID), "eventID.................");
  const data_response = await fetchData(eventID);

  return NextResponse.json({
    data: data_response,
  });
}
