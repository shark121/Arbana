import { NextRequest, NextResponse } from "next/server";
import {} from "firebase/firestore";
import { getCache, setCache } from "@/lib/server_utils";

export async function GET(req: NextRequest, data: { data: string[] }) {
  //   return NextResponse.redirect("/api/data/create/booking/" + req.body.data.join("/"))
  await setCache("test", "9000");

  const res = await getCache("test").then((data) => {
    console.log(data);
    return data;
  });

  console.log(res);
  return NextResponse.json({ success: res });
}
