import { NextRequest, NextResponse } from "next/server";
import { generateRandomId, vars } from "@/lib/utils";
import dotenv, { config } from "dotenv";
import { doc, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
import { TicketType } from "@/lib/types";
import { EventType } from "../../../../../../components/ui/eventComponent";
import { startPaymentProcess } from "../../route.utils";

export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const ticketFormData = await req.formData();
  const quantity = Number(context.params.data[1]);
  const price = Number(context.params.data[2]);
  const amount = price;
  const provider = context.params.data[0];

  console.log(price, "price .......")

  const ticketData: Omit<TicketType, "transactionID"> = JSON.parse(
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
