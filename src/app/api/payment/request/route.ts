import { NextRequest } from "next/server";



export async function GET(req: NextRequest, context: { params: { data: string[] } }) {
   const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
             resolve("Promise resolved");
        }, 1000);
     }
    );

    return promise;
}



