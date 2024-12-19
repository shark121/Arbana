import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent,} from "next/server";

export function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  if (request.url.startsWith(process.env.NEXT_PUBLIC_DOMAIN + "/ticket")) {
    const ticketIdandeventId = request.url.slice(
      request.url.indexOf("/ticket") + "/ticket".length + 1,
      request.url.indexOf("?")
    );
   
    const [ticketId,eventId] = ticketIdandeventId.split("@") 

    if ((request.url.indexOf("trxref") == -1) || (request.url.indexOf("reference") == -1))
        return

    const trxref = request.url.slice(
      request.url.indexOf("trxref=") + 1 + "trxref=".length,
      request.url.indexOf("&")
    );

    const reference = request.url.slice(
      request.url.indexOf("reference=") + 1 + "reference=".length
    );

    console.log(ticketId, trxref, reference);

    event.waitUntil(
      fetch(process.env.NEXT_PUBLIC_DOMAIN + "/api/payment/response/data/", {
        body: JSON.stringify({ trxref, reference, ticketId, eventId }),
        method: "POST",
      })
    );

    return NextResponse.redirect(process.env.NEXT_PUBLIC_DOMAIN + `/ticket/${ticketId}`
    //   new URL( process.env.NEXT_PUBLIC_DOMAIN + `/ticket/${ticketId}`)
    );
  }
}
