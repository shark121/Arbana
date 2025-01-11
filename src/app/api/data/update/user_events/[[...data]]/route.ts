import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/firebase.config";
import { createRequestType } from "@/app/myEvents/create/page";
import {
  collection,
  doc,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
import { setCache, getCache, existsInCache } from "@/lib/server_utils";
import { algoliasearch } from "algoliasearch";

const algoliaClient = algoliasearch(
  "W6M4AJCW2Z",
  "d8b19e7a00ef293456a27f59f480e776"
);

const eventCollectionRef = collection(database, "events");

// async function addEventWithFile(
//   buffer: Buffer,
//   nameID: string,
//   fileType: string,
//   restToJSON: Omit<createRequestType, "imageFile">,
//   eventIdtoString: string,
//   userID: string
// ) {
//   const nameIDTrim = nameID.trim();
//   console.log(nameIDTrim, fileType);
//   let eventData: any[] = [];

//   const storageRef = ref(storage, `${nameIDTrim}.${fileType}`);
//   const uploadTask = uploadBytesResumable(
//     storageRef,
//     buffer as unknown as Blob
//   );
//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       switch (snapshot.state) {
//         case "paused":
//           console.log("Upload is paused");
//           break;
//         case "running":
//           console.log("Upload is running");
//           break;
//       }
//     },
//     (error) => {
//       console.log("an error occured while uploading the file");
//       console.log(".........................................");
//     },
//    async () => {
//       await getDownloadURL(uploadTask.snapshot.ref)
//         .then(async (url) => {
//           const eventUploadData = {
//             ...restToJSON,
//             imageUrl: url as unknown as string,
//           };

//           const eventDocRef = doc(eventCollectionRef, eventIdtoString);
//           const userDocRef = doc(collection(database, "users"), userID);

//         await  runTransaction(database, async (transaction) => {
//             transaction.set(eventDocRef, eventUploadData);
//             transaction.set(
//               userDocRef,
//               { events: arrayUnion(eventUploadData) },
//               { merge: true }
//             );
//           })
//             .then(async () => {
//               console.log("transaction done");

//               await getCache(userID + "_events").then((data) => {
//                 console.log(JSON.parse(data));
//                 eventData = JSON.parse(data);
//                 eventData.push(eventUploadData);
//                 setCache(userID + "_events", eventData);
//               });
//             })
//             .catch((error) => {
//               console.error("Error adding document: ", error);
//             });
//         })
//         .catch((error) => NextResponse.error());
//     }
//   );

//   return eventData;
// }

async function addEventWithFile(
  buffer: Buffer,
  nameID: string,
  fileType: string,
  restToJSON: Omit<createRequestType, "imageFile">,
  eventIdtoString: string,
  userID: string
) {
  const nameIDTrim = nameID.trim();
  const storageRef = ref(storage, `${nameIDTrim}.${fileType}`);

  try {
  const uploadTaskPromise = new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, buffer);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload error: ", error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });

  const downloadURL = await uploadTaskPromise;

  const eventUploadData = { ...restToJSON, imageUrl: downloadURL };

  const eventDocRef = doc(eventCollectionRef, eventIdtoString);
  const userDocRef = doc(collection(database, "users"), userID);

  await runTransaction(database, async (transaction) => {
    transaction.set(eventDocRef, eventUploadData);
    transaction.set(
      userDocRef,
      { events: arrayUnion(eventUploadData) },
      { merge: true }
    );
  });

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

  const cachedEvents = JSON.parse(await getCache(userID + "_events")) || [];
  cachedEvents.push(eventUploadData);
  await setCache(userID + "_events", cachedEvents);

  return cachedEvents;

} catch (error) {
  console.error("Error in addEvent: ", error);
  throw error;
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
    transaction.set(eventDocRef, restToJSON);
    transaction.set(
      userDocRef,
      { events: arrayUnion(restToJSON) },
      { merge: true }
    );
  })
    .then(async () => {
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

      getCache(userID + "_events").then((data) => {
        // console.log(JSON.parse(data));
        eventData = JSON.parse(data);
        eventData.push(restToJSON);
        setCache(userID + "_events", eventData);
      });
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

  console.log(collectedData, "collectedData");

  const rest = collectedData.get("rest") as string;

  const restToJSON: Omit<createRequestType, "imageFile"> =
    rest && JSON.parse(rest);

  const eventId = restToJSON.eventId;

  const eventIdtoString = String(eventId);

  const userID = restToJSON.userID;

  if (!collectedData.get("imageFile")) {
    uploadWithoutFile({
      restToJSON,
      eventIdtoString,
      userID,
    });

    return NextResponse.json({ response: "success" });
  }

  const imageFile = collectedData.get("imageFile") as File;

  uploadWithoutFile({
    restToJSON,
    eventIdtoString,
    userID,
  });

  const getFileTypeStartIndex = imageFile.type.indexOf("/") + 1;

  console.log(getFileTypeStartIndex, "getFileTypeStartIndex");

  const fileType = imageFile.type.slice(getFileTypeStartIndex);

  const bytes = await imageFile.arrayBuffer();

  const buffer = Buffer.from(bytes);

  console.log(
    restToJSON,
    "restToJSON....................................................................."
  );

  await addEventWithFile(
    buffer,
    eventIdtoString,
    fileType,
    restToJSON,
    eventIdtoString,
    userID
  )
    .catch((error) => console.error("Error adding document: ", error))
    .then((eventData) => {
      console.log(eventData, ".......");
    });

  return NextResponse.json({ response: "success" });
}
