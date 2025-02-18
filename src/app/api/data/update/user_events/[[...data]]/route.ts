import { NextRequest, NextResponse } from "next/server";
import { storage, database, functions } from "@/firebase.config";
import { createRequestType } from "@/app/myEvents/create/page";
import { httpsCallable } from "firebase/functions";
import {
  collection,
  doc,
  runTransaction,
  arrayUnion,
  getDoc,
  writeBatch,
  arrayRemove,
  FieldValue,
} from "firebase/firestore";
import { setCache, getCache, existsInCache } from "@/lib/server_utils";
import { algoliasearch } from "algoliasearch";
import { AvailableSeatsType, EventSchemaType } from "@/lib/types";
import { uploadFile } from "@/lib/server_utils";

const updateTeamEvent = httpsCallable(functions, "updateTeamEvent");

const algoliaClient = algoliasearch(
  "W6M4AJCW2Z",
  "d8b19e7a00ef293456a27f59f480e776"
);

const eventCollectionRef = collection(database, "events");

async function UpdateEvent({
  file,
  rest,
  auth,
}: {
  file?: File;
  rest: string;
  auth: string;
}): Promise<{ err: string | null; status: number }> {
  
  auth = JSON.parse(auth)
  console.log(auth, "auth................#########")

  const restToJSON: Omit<createRequestType, "imageFile"> =
    rest && JSON.parse(rest);

  const eventIdtoString = String(restToJSON.eventId);

  const userID = restToJSON.userID;

  try {
    const downloadURL = file && (await uploadFile({ file }));

    console.log(downloadURL, "downloadURL");

    const eventUploadData = file
      ? { ...restToJSON, imageUrl: downloadURL }
      : restToJSON;

    // const teamData = (
    //   await getDoc(doc(collection(database, "teams"), eventIdtoString))
    // ).data();

    // const teamMembers = teamData ? Object.keys(teamData) : [];

    const batch = writeBatch(database);

    const previousEventState = (
      await getDoc(doc(collection(database, "users"), userID))
    ).data();

    const allUserEvents =
      previousEventState && (previousEventState.events as EventSchemaType[]);

    console.log(allUserEvents, "allUserEvents");

    const targetEvent =
      allUserEvents &&
      allUserEvents.find((event) => String(event.eventId) === eventIdtoString);

    await runTransaction(database, async (transaction) => {
      transaction
        .get(doc(collection(database, "events"), eventIdtoString))
        .then((eventDoc) => {
          if (eventDoc.exists()) {
            const eventData = eventDoc.data();

            console.log(eventData, "event data");

            const oldAvailableSeats =
              eventData.availableSeats as AvailableSeatsType[];

            const oldMap = new Map(
              oldAvailableSeats.map((item) => [item.tier, item])
            );

            eventUploadData.availableSeats = eventUploadData.availableSeats.map(
              (item) => oldMap.get(item.tier) || item
            );

            transaction.set(
              doc(collection(database, "events"), eventIdtoString),
              {
                ...eventUploadData,
              }
            );
          } else {
            console.log("Event does not exist in the database");
          }
        });
    });
   
    
    console.log(auth)

    await updateTeamEvent({authInfo: auth, eventUploadData, targetEvent})

    batch.update(doc(eventCollectionRef, eventIdtoString), eventUploadData);

    batch.commit();

    const algoliaUpdateBundle = {
      indexName: "events_index",
      objectID: eventIdtoString,
      attributesToUpdate: eventUploadData,
      createIfNotExists: true,
    };

    await algoliaClient
      .partialUpdateObject(algoliaUpdateBundle)
      .then(() => console.log("algolia updated"))
      .catch((error) => console.error("Error updating algolia: ", error));

    return { status: 200, err: null };
  } catch (error) {
    console.error("Error in addEvent: ", error);
    return { status: 500, err: String(error) };
    // throw error;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const collectedData = await req.formData();

  const rest = collectedData.get("rest") as string;

  const imageFile = (collectedData.get("imageFile") as File) || null;

  const auth = collectedData.get("auth") as string;


  
  const response = await UpdateEvent({
    file: imageFile,
    rest,
    auth,
  })
  .catch((error) => console.error("Error adding document: ", error))
  .then((eventData) => {
    // console.log(eventData, ".......");
  });

  return NextResponse.json({ response });

}
