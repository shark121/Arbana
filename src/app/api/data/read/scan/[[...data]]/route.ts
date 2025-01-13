import { NextRequest, NextResponse } from "next/server";
import { runTransaction, collection, doc } from "firebase/firestore";
import { database } from "@/firebase.config";
import { auth } from "@/firebase.config";

// async function verifyTicket(ticketID: string, eventID: string, creatorID: string) {
//   // const userId = auth.currentUser?.uid ?? null;

//   // if (!userId) {
//   //   console.log("user not signed in");  
//   //   return { scans: null };
//   // }

//   // if (userId !== creatorID) {
//   //   console.log("user not creator");

//   //   // return { scans: null };
//   // }

//   return await runTransaction(database, async (transaction) => {
//     const eventBookingsRef = doc(collection(database, "bookings"), eventID);
//     const ticketBookings = await transaction.get(eventBookingsRef);

//     console.log(ticketBookings.data());

    

//     if (!ticketBookings.exists()) {
//       console.log("does not exist in DB");
//       return { scans: null };
//     }

//     const bookingsData = ticketBookings.data();

//     console.log(Object.keys(bookingsData));

//     if (Object.keys(bookingsData).includes(ticketID)) {
//       console.log(bookingsData, "bookings data");
//       const ticketData = bookingsData[ticketID];
//       console.log(ticketData, "ticket Data.......................");

//       const scans = ticketData.scans;

//       ticketData["scans"] = 0;

//       transaction.set(
//         eventBookingsRef,
//         { [ticketID]: ticketData },
//         { merge: true }
//       );
//       return { scans };
//     }

//     console.log("none true");
//     return { scans: null };
//   });
// }


async function processTransaction(eventID: string, ticketID: string) {

  try {
    const result = await runTransaction(database, async (transaction) => {

      const eventBookingsRef = doc(collection(database, "bookings"), eventID);

      const ticketBookings = await transaction.get(eventBookingsRef);

      console.log(ticketBookings.data());

      if (!ticketBookings.exists()) {
        console.log("Document does not exist in the database");
        return { scans: null };
      }

      const bookingsData = ticketBookings.data();

      console.log(Object.keys(bookingsData));

      if (Object.keys(bookingsData).includes(ticketID)) {
        console.log(bookingsData, "bookings data");
        const ticketData = bookingsData[ticketID];
        console.log(ticketData, "ticket Data.......................");

        const scans = ticketData.scans;

        ticketData["scans"] = 0;

        transaction.set(
          eventBookingsRef,
          { [ticketID]: ticketData },
          { merge: true }
        );

        return { scans };
      }

      console.log("Ticket ID not found in the bookings data");
      return { scans: null };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error; 
  }
}


export async function POST(
  req: NextRequest,
  context: { params: { data: string[] } }
) {
  const data = await req.json();
  const { ticketID, eventID } = data;
  console.log(ticketID, eventID, "ticket ID event ID");
  const response = await processTransaction(eventID,ticketID);
  const scans = response.scans;
  console.log(response, "response............");

  return NextResponse.json({ scans });
}
