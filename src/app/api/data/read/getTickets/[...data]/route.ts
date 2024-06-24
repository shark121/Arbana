import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context:{params:{data:string[]}}) {

//   const requestedNumber = Number(context.params.data[0])

//   let myPromise = new Promise((resolve, reject) => {
//     let available = 10
//     if (available < requestedNumber) {
//       reject(false)
//     }else{
//       resolve(true)
//     }
//     // setTimeout(() => {
//     //   resolve(available > Number(requestedNumber));
//     // }, 5000);
//   });

//  const response = await myPromise.then((value) => value).catch((error) => error);

  return NextResponse.json({ response: true});

}
