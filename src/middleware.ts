import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { url } = request;
  const { pathname, origin } = new URL(url);
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const domain = `${protocol}://${host}`;

  // console.log(
  //   request.headers.get("host"),
  //   request.headers.get("referer"),
  //   request.headers.get("origin"),
  //   ".................................."
  // );

  if (
    request.nextUrl.pathname.startsWith("/myEvents") ||
    request.nextUrl.pathname.startsWith("/tickets")
  ) {
    if (!request.cookies.get("user"))
      return NextResponse.redirect(origin + "/home");
  }

  if (request.nextUrl.pathname.startsWith("/ticket")) {
    const ticketIdandeventId = request.url.slice(
      request.url.indexOf("/ticket") + "/ticket".length + 1,
      request.url.indexOf("?")
    );

    const [ticketId, eventId, userId] = ticketIdandeventId.split("@");

    if (
      request.url.indexOf("trxref") == -1 ||
      request.url.indexOf("reference") == -1
    )
      return;

    const trxref = request.url.slice(
      request.url.indexOf("trxref=") + 1 + "trxref=".length,
      request.url.indexOf("&")
    );

    const reference = request.url.slice(
      request.url.indexOf("reference=") + 1 + "reference=".length
    );

    console.log(ticketId, trxref, reference);

    event.waitUntil(
      fetch(domain + "/api/payment/response/data/", {
        body: JSON.stringify({ trxref, reference, ticketId, eventId, userId }),
        method: "POST",
      })
    );

    return NextResponse.redirect(
      domain + `/ticket/${ticketId}`
      //   new URL( process.env.NEXT_PUBLIC_DOMAIN + `/ticket/${ticketId}`)
    );
  }
}
