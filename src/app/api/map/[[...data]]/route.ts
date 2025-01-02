import { NextResponse, NextRequest } from "next/server";
import { Libraries, useLoadScript } from "@react-google-maps/api";
const libs: Libraries = ["geometry", "drawing", "visualization", "places"];

export default async function GET() {
  

  return NextResponse.json({ status: 200 });
}
