import { NextRequest, NextResponse } from "next/server";
import { getDoc, collection, doc, setDoc } from "firebase/firestore";
import { database, storage, functions, auth } from "@/firebase.config";
import { httpsCallable } from "firebase/functions";
import { uploadFile } from "@/lib/server_utils";
import { sendEmailVerification } from "firebase/auth";

const accountCollectionRef = collection(database, "users");

const updateEmail = httpsCallable(functions, "updateEmail");

export async function GET(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const { data } = context.params;
  const userId = data[0];
  const userDocRef = doc(accountCollectionRef, userId);
  const accountInfo = await getDoc(userDocRef).then((docSnap) => {
    if (docSnap.exists()) {
      return docSnap.data().accountInfo;
    }
  });

  return NextResponse.json({ data: accountInfo });
}

export async function PATCH(req: NextRequest) {
  const data = await req.formData();
  const imageFile = data.get("imageFile") as File;
  const rest = data.get("rest") as string;
  const restToJSON = JSON.parse(rest);
  const uid = restToJSON.uid;

  if (restToJSON.shouldUpdateEmail) {
    const email = restToJSON.email;
    const user = auth.currentUser;

    if (!user) return NextResponse.json({ status: 401 });

    await sendEmailVerification(user)
      .then(async() => {
        console.log("email sent");
        // const updateEmailResponse = await updateEmail({ email, uid });
        // console.log(updateEmailResponse, "updateEmailResponse");
      })
      .catch((error) => {
        console.error("Error in sending email", error);
      });
  }

  if (imageFile) {
    const downloadURL = await uploadFile({ file: imageFile });
    restToJSON["imageUrl"] = downloadURL;
    setDoc(
      doc(accountCollectionRef, uid),
      { accountInfo: restToJSON },
      { merge: true }
    );
  } else {
    setDoc(
      doc(accountCollectionRef, uid),
      { accountInfo: restToJSON },
      { merge: true }
    );
  }

  console.log(data, "data");
  return NextResponse.json({ status: 200 });
}

export async function POST() {}

export async function PUT() {}
