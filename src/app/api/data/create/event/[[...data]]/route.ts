import { NextRequest, NextResponse } from "next/server";
import { storage, database } from "@/../../firebase.config";
import { createRequestType } from "@/app/myEvents/create/page";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  runTransaction,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";

const eventCollectionRef = collection(database, "events");

async function fileUploadFunc(
  buffer: Buffer,
  nameID: string,
  fileType: string,
  restToJSON: Omit<createRequestType, "imageFile">,
  eventIdtoString: string
) {
  const nameIDTrim = nameID.trim();
  console.log(nameIDTrim, fileType);

  const storageRef = ref(storage, `${nameIDTrim}.${fileType}`);
  const uploadTask = uploadBytesResumable(storageRef, buffer);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.log("an error occured while uploading the file");
      console.log(".........................................");
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then(async (url) => {
          const eventUploadData = {
            ...restToJSON,
            imageUrl: url as unknown as string,
          };

          console.log(url, ".........................url");

          const docRef = doc(eventCollectionRef, eventIdtoString);

          await setDoc(docRef, eventUploadData)
            .then((docRef) => {
              console.log(
                "document added ...................................................."
              );
            })
            .catch((error) => console.error("Error adding document: ", error));
        })
        .catch((error) => NextResponse.error());
    }
  );

}

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const collectedData = await req.formData();
  const imageFile = collectedData.get("imageFile") as File;
  const rest = collectedData.get("rest") as string;
  const restToJSON: Omit<createRequestType, "imageFile"> =
    rest && JSON.parse(rest);
  const getFileTypeStartIndex = imageFile.type.indexOf("/") + 1;
  const fileType = imageFile.type.slice(getFileTypeStartIndex);
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const eventId = restToJSON.eventId;
  const eventIdtoString = String(eventId);

  await fileUploadFunc(
    buffer,
    eventIdtoString,
    fileType,
    restToJSON,
    eventIdtoString
  )
    .catch((error) => console.error("Error adding document: ", error))
    .then(async () => {
      await getDocs(eventCollectionRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("done");
          console.log(doc.id, " => ", doc.data());
        });
      });
    });

  return NextResponse.json({ response: "success" });
}
