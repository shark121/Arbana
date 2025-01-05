import { NextRequest, NextResponse } from "next/server";
import { generateRandomId, vars } from "@/lib/utils";
import dotenv, { config } from "dotenv";
import { doc, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
import { startPaymentProcess } from "../../route.utils";

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const ticketFormData = await req.formData();
  const provider = context.params.data[0];
  const amount = Math.ceil(Number(context.params.data[1]));

  const ticketData: Omit<TicketSchemaType, "transactionID"> = JSON.parse(
    ticketFormData.get("ticket") as string
  );

  const eventDocRef = doc(collection(database, "events"), ticketData.eventID);

  console.log(ticketData, "ticketData");

  const { response, error } = await startPaymentProcess({
    amount,
    provider,
    ticketData,
  });

  if (error) {
    console.error("Error completing payment process: ", error);
    return NextResponse.json({ type: "error", response: error });
  }
  return NextResponse.json({ type: "data", response });
}
