import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/firebase.config";
import { createRequestType } from "@/app/myEvents/create/page";
import {
  collection,
  doc,
  runTransaction,
  arrayUnion,
  getDoc,
  writeBatch,
  arrayRemove,
  FieldValue
} from "firebase/firestore";
import { setCache, getCache, existsInCache } from "@/lib/server_utils";
import { algoliasearch } from "algoliasearch";
import { AvailableSeatsType, EventSchemaType } from "@/lib/types";
import { uploadFile } from "@/lib/server_utils";

const algoliaClient = algoliasearch(
  "W6M4AJCW2Z",
  "d8b19e7a00ef293456a27f59f480e776"
);

const eventCollectionRef = collection(database, "events");


async function UpdateEvent({
  file,
  restToJSON,
  eventIdtoString,
  userID,
}: {
  file?: File;
  restToJSON: Omit<createRequestType, "imageFile">;
  eventIdtoString: string;
  userID: string;
})  :Promise<{err: string | null, status: number
}>{
     

  try {

    const downloadURL = file && await uploadFile({ file });

    console.log(downloadURL, "downloadURL");

    const eventUploadData = file  ? { ...restToJSON, imageUrl: downloadURL } : restToJSON

    const teamData  = (await getDoc(doc(collection(database, "teams"), eventIdtoString))).data()
     
    const teamMembers = teamData ? Object.keys(teamData) : []

    const batch = writeBatch(database);

    const previousEventState = (await getDoc(doc(collection(database, "users"), userID))).data()

    const allUserEvents = previousEventState && previousEventState.events as EventSchemaType[]

    console.log(allUserEvents, "allUserEvents");

    const targetEvent = allUserEvents && allUserEvents.find((event) => (String(event.eventId) === eventIdtoString))



    await runTransaction(database, async (transaction) => {
      transaction.get(doc(collection(database, "events"), eventIdtoString)).then((eventDoc) => {
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();

          console.log(eventData, "event data");

          const oldAvailableSeats = eventData.availableSeats as AvailableSeatsType[]

          const oldMap = new Map(oldAvailableSeats.map((item) => [item.tier, item]));

          eventData.availableSeats = eventUploadData.availableSeats.map((item) => oldMap.get(item.tier) || item);

          transaction.set(doc(collection(database, "events"), eventIdtoString), {
             ...eventUploadData,
          });  
         
        } else {
          console.log("Event does not exist in the database");
        }
      })
    })

    for (let member of teamMembers) {
      if(!(targetEvent && targetEvent)) return {status: 404, err: "targetEvent not found"}
      
      batch.update(doc(collection(database, "users"), member), {  
        events: arrayRemove(targetEvent),
      });

      batch.update(doc(collection(database, "users"), member), {
        events: arrayUnion(eventUploadData),
      });
      
    }

    batch.update(doc(eventCollectionRef, eventIdtoString), eventUploadData);  

    batch.commit()

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

      
     return {status: 200, err:null}
    // await runTransaction(database, async (transaction) => {


    //   const userDocRef = doc(collection(database, "users"), userID);

    //   const userDocs = await transaction.get(userDocRef);

    //   let filteredEvents = [];

    //   if (userDocs.exists()) {

    //     const userData = userDocs.data();
    //     if (userData) {
    //       filteredEvents = userData.events.filter(
    //         (event: EventSchemaType) =>
    //           String(event.eventId) !== eventIdtoString
    //       );

    //       filteredEvents.push(eventUploadData);

    //       transaction.update(
    //         userDocRef,
    //         { events: filteredEvents }
    //       );
    //     }


    //   }

    //   transaction.set(eventDocRef, eventUploadData);

    //   return filteredEvents;
    // }).then(async (filteredEvents) => {
      
     

    //   // const cachedEvents = JSON.parse(await getCache(userID + "_events")) || [];
    //   // cachedEvents.push(eventUploadData);
    //   await setCache(userID + "_events", filteredEvents);

    //   return filteredEvents;
    // });
  
  
  } catch (error) {
    console.error("Error in addEvent: ", error);
    return { status: 500, err:String(error) };
    // throw error;
  }
}

function uploadWithoutFile({
  restToJSON,
  eventIdtoString,
  userID,
}: {
  restToJSON: Omit<createRequestType, "imageFile">;
  eventIdtoString: string;
  userID: string;
}) {
  const eventDocRef = doc(eventCollectionRef, eventIdtoString);
  const userDocRef = doc(collection(database, "users"), userID);
  let eventData: any[] = [];

  runTransaction(database, async (transaction) => {
    const userDocs = await transaction.get(userDocRef);
    let filteredEvents = [];
    if (userDocs.exists()) {
      const userData = userDocs.data();

      if (userData) {
        filteredEvents = userData.events.filter(
          (event: EventSchemaType) => String(event.eventId) !== eventIdtoString
        );
        console.log(
          userData.events,
          filteredEvents,
          "filteredEvents....................."
        );

        // return NextResponse.json({ status: 200 });
        filteredEvents.push(restToJSON);

        transaction.set(
          userDocRef,
          { events: filteredEvents },
          { merge: true }
        );
      }
    }

    console.log(filteredEvents, "filteredEvents.....................");

    transaction.set(eventDocRef, restToJSON);
    return filteredEvents;
  })
    .then(async (filteredEvents) => {
      console.log("transaction done");

      const algoliaUpdateBundle = {
        indexName: "events_index",
        objectID: eventIdtoString,
        attributesToUpdate: restToJSON,
        createIfNotExists: true,
      };

      await algoliaClient
        .partialUpdateObject(algoliaUpdateBundle)
        .then(() => console.log("algolia updated"))
        .catch((error) => console.error("Error updating algolia: ", error));

      // getCache(userID + "_events").then((data) => {
      // });
        // console.log(JSON.parse(data));
        // eventData = JSON.parse(data);
        // eventData.push(restToJSON);

        setCache(userID + "_events", filteredEvents);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const collectedData = await req.formData();

  const rest = collectedData.get("rest") as string;

  const restToJSON: Omit<createRequestType, "imageFile"> =
    rest && JSON.parse(rest);

  const eventIdtoString = String(restToJSON.eventId);

  const userID = restToJSON.userID;

  // if (!collectedData.get("imageFile")) {
  //   uploadWithoutFile({
  //     restToJSON,
  //     eventIdtoString,
  //     userID,
  //   });

  //   return NextResponse.json({ response: "success" });
  // }

  const imageFile = collectedData.get("imageFile") as File || null;

  const response = await UpdateEvent({
    file: imageFile,
    restToJSON,
    eventIdtoString,
    userID,
  })
    .catch((error) => console.error("Error adding document: ", error))
    .then((eventData) => {
      console.log(eventData, ".......");
    });
   
  return NextResponse.json({ response });
}
