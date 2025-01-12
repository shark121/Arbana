import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/firebase.config";
import { createRequestType } from "@/app/myEvents/create/page";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";


import { setCache, getCache,} from "@/lib/server_utils";
import { uploadFile } from "@/lib/server_utils";

const eventCollectionRef = collection(database, "events");
const teamsCollectionRef = collection(database, "teams");

async function addEvent({
  file,
  restToJSON,
  eventIdtoString,
  userID,
}: {
  restToJSON: Omit<createRequestType, "imageFile">;
  eventIdtoString: string;
  userID: string;
  file: File;
}) {
  try {
    const downloadURL = await uploadFile({ file });

    const eventUploadData = { ...restToJSON, imageUrl: downloadURL };

    const eventDocRef = doc(eventCollectionRef, eventIdtoString);
    const userDocRef = doc(collection(database, "users"), userID);
    const teamsDocRef = doc(teamsCollectionRef, eventIdtoString);

    const ownerPermissions = {
      [userID]: {
        info: restToJSON.creator,
        permissions: {
          canEdit: true,
          canDelete: true,
          canView: true,
          canScan: true,
          canAddToTeam: true,
          canViewStats: true,
        },
      },
    };

    await runTransaction(database, async (transaction) => {
      transaction.set(
        userDocRef,
        { events: arrayUnion(eventUploadData) },
        { merge: true }
      );

      transaction.set(teamsDocRef, ownerPermissions);
      transaction.set(eventDocRef, eventUploadData);
    });

    const cachedEvents = JSON.parse(await getCache(userID + "_events")) || [];
    cachedEvents.push(eventUploadData);
    await setCache(userID + "_events", cachedEvents);

    return cachedEvents;
  } catch (error) {
    console.error("Error in addEvent: ", error);
    throw error;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const collectedData = await req.formData();

  console.log(collectedData, "collectedData");

  const imageFile = collectedData.get("imageFile") as File;

  const rest = collectedData.get("rest") as string;

  const restToJSON: Omit<createRequestType, "imageFile"> =
    rest && JSON.parse(rest);

  const eventIdtoString = String(restToJSON.eventId);

  const userID = restToJSON.userID;

  console.log(
    restToJSON,
    "restToJSON....................................................................."
  );

  return await addEvent({
    file: imageFile,
    restToJSON,
    eventIdtoString,
    userID,
  })
    .catch((error) => {
      console.error("Error adding document: ", error);
      return NextResponse.error();
    })
    .then((eventData) => {
      console.log(eventData, ".......");
      return NextResponse.json({ response: "success", eventData, e: "e" });
    });
}
