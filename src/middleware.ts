import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { url } = request;
  const { pathname, origin } = new URL(url);
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const domain = `${protocol}://${host}`;
  
  const allowedDomains = ["localhost:3000", "arbana.vercel.app", "localhost:3001", "www.arbana.io"];

  if (!allowedDomains.includes(host as string)) return NextResponse.json({ message: "Domain not allowed" }, { status: 400 });

  console.log(request.cookies.get("user")?.value, "user cookie");

  if (
    request.nextUrl.pathname.startsWith("/myEvents") ||
    request.nextUrl.pathname.startsWith("/account") 
  ) {
    if (!request.cookies.get("user") || request.cookies.get("user") && request.cookies.get("user")?.value.indexOf("email") == -1)
      return NextResponse.redirect(origin + `/home?redirect=true&path=${request.nextUrl.pathname}`);
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
      request.url.indexOf("trxref=")  + "trxref=".length,
      request.url.indexOf("&")
    );

    const reference = request.url.slice(
      request.url.indexOf("reference=")  + "reference=".length
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
    );
  }
}
