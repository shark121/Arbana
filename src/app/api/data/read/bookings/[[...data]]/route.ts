import { NextRequest, NextResponse } from "next/server";
import { database } from "@/firebase.config";
import { collection, doc, getDoc } from "firebase/firestore";

async function getUserTickets(userID: string) {
  const userDocRef = doc(collection(database, "users"), userID)
  const userInfo = await getDoc(userDocRef).then((doc) => {
      if (doc.exists()) {
          console.log(doc.data())
          return doc.data()
      } else {
          return null
      }
  }
  )
  
  return userInfo ? userInfo.tickets : null;
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
