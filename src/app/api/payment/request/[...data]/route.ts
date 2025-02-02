import { NextRequest, NextResponse } from "next/server";
import dotenv, { config } from "dotenv";
import { doc, collection } from "firebase/firestore";
import { database, functions } from "@/firebase.config";
import { TicketSchemaType } from "@/lib/types";
// import { startPaymentProcess } from "../../route.utils";
import {httpsCallable} from "firebase/functions";


export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  try {
    const startPaymentProcess = httpsCallable(functions, "startPaymentProcess");
    
    const ticketFormData = await req.formData();
    const provider = context.params.data[0];
    const amount = Math.ceil(Number(context.params.data[1]));
  
    const ticketData: Omit<TicketSchemaType, "transactionID"> = JSON.parse(
      ticketFormData.get("ticket") as string
    );
    
    const eventDocRef = doc(collection(database, "events"), ticketData.eventID);
    
    console.log(ticketData, "ticketData");
    
    const response = await startPaymentProcess({
      amount,
      provider,
      ticketData,
      domain : process.env.NEXT_PUBLIC_DOMAIN
    });
    
    return NextResponse.json({ type: "data", response });
  } catch (error) {
    console.error("Error completing payment process:", error);
    return NextResponse.json({ type: "error", response: "An error occured, please try again later" });
  }
  ;
}
