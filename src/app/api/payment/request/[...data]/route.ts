import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  // const phoneNumber = context.params.data[0];

  // console.log(phoneNumber);

  // let myPromise = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve("paid");
  //   }, 5000);
  // });

  // let response = myPromise.then((value) => value);

  return NextResponse.json({ response: "weiorhfowiofiejoijwoi" }); // expected output: "foo"
}
