import { NextResponse, NextRequest } from "next/server";
import {
  runTransaction,
  writeBatch,
  collection,
  getDoc,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { database, functions } from "@/firebase.config";
import { BatteryCharging } from "lucide-react";
import { TeamDataType } from "@/lib/types";
import { httpsCallable } from "firebase/functions";

const teamCollectionRef = collection(database, "teams");

export async function GET(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const eventId = context.params.data[0];
  const teamDocRef = doc(teamCollectionRef, eventId);

  return await getDoc(teamDocRef).then((docSnap) => {
    if (docSnap.exists()) {
      console.log(docSnap.data());
      return NextResponse.json(docSnap.data());
    } else {
      return NextResponse.json({ status: 404 });
    }
  });

  //   return NextResponse.json({ stats: 200 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    eventId: string;
    updatedPermissionsObject: TeamDataType;
  };
  console.log(body);
  const batch = writeBatch(database);

  const teamsDocRef = doc(teamCollectionRef, body.eventId);

  batch.set(teamsDocRef, body.updatedPermissionsObject, { merge: true });

  batch.commit();

  return NextResponse.json({ stats: 200 });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    eventId: string;
    email: string;
    permissions: TeamDataType;
  };

  console.log(body);

  //   return NextResponse.json({ stats: 200 });

  const addTeamMember = httpsCallable(functions, "addTeamMember");

  try {
    return await addTeamMember({
      eventId: body.eventId,
      email: body.email,
      permissions: body.permissions,
    }).then((result) => {
      console.log(result);
      return NextResponse.json({ stats: 200 });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ stats: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { data: string[] } }) {

  try {
    const eventId = context.params.data[0];
    const uid = context.params.data[1];

    console.log(eventId, uid);

    const teamsDocRef = doc(teamCollectionRef, eventId);

    updateDoc(teamsDocRef, {
      [uid]: deleteField(),
    });

    return NextResponse.json({ stats: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ stats: 500 });
  }
}
