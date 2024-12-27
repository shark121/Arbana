"use client";
import { useState, useEffect } from "react";
import { TicketSchemaType } from "@/lib/types";
import { User } from "firebase/auth";
import Loading from "@/app/loading";
import TicketsListComponents from "../../../components/components/tickets/ticketsListComponent";
import { comfortaa } from "../../app/page";
import SheetComponent from "../../../components/components/sheet";
import { getCookie } from "@/lib/utils";
import { connectStorageEmulator } from "firebase/storage";

const fetchTickets = async ({ userID }: { userID: string }) => {
  const res = await fetch(`/api/data/read/bookings/${userID}`);
  const data = await res.json();
  return data;
};

export default function GetTicket() {
  const [tickets, setTickets] = useState<TicketSchemaType[]>([]);
  const [userState, setUserState] = useState<User>();
  const [ticketNames, setTicketNames] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJSON = JSON.parse(sessionStorage.getItem("user") as string);

    setUserState(userJSON);
  }, []);

  async function handleDelete(ticket: TicketSchemaType) {
    console.log("hadling delete........")
    const data = new FormData();
    data.append("ticketData", JSON.stringify(ticket));
    await fetch("/api/data/update/tickets/", {
      body: data,
      method: "POST",
    });

    console.log("handle delete...............");

    setTickets(tickets.filter((el) => el.ticketID !== ticket.ticketID));
  }

 

  useEffect(() => {
    console.log(userState?.uid);

    userState &&
      fetchTickets({ userID: userState.uid }).then((data) => {
        // console.log(data.res);
        setTickets(data.res);
      });
  }, [userState]);

  // useEffect(()=>{
  //    setTickets([
  //     {
  //       "name": "Concert Night",
  //       "startDate": "2024-12-31",
  //       "endDate": "2025-01-01",
  //       "eventID": "EVT-001",
  //       "tier": "VIP",
  //       "price": 150.00,
  //       "imageUrl": "https://example.com/images/concert.jpg",
  //       "scans": 0,
  //       "uid": "USER-123",
  //       "createdAt": "2023-12-23",
  //       "transactionID": "TXN-001",
  //       "ticketID": "TCKT-001",
  //       "purchaseDate": "2023-12-23",
  //       "seatNumber": "A12",
  //       "status": "active",
  //       "buyerID": "BUYER-001"
  //     },
  //     {
  //       "name": "Tech Conference",
  //       "startDate": "2025-02-10",
  //       "endDate": "2025-02-10",
  //       "eventID": "EVT-002",
  //       "tier": "General",
  //       "price": 75.00,
  //       "imageUrl": "https://example.com/images/tech-conference.jpg",
  //       "scans": 0,
  //       "uid": "USER-124",
  //       "createdAt": "2023-12-23",
  //       "transactionID": "TXN-002",
  //       "ticketID": "TCKT-002",
  //       "purchaseDate": "2023-12-23",
  //       "seatNumber": "B21",
  //       "status": "active",
  //       "buyerID": "BUYER-002"
  //     },
  //     {
  //       "name": "Art Exhibit",
  //       "startDate": "2025-03-15",
  //       "endDate": "2025-03-15",
  //       "eventID": "EVT-003",
  //       "tier": "Premium",
  //       "price": 120.00,
  //       "imageUrl": "https://example.com/images/art-exhibit.jpg",
  //       "scans": 0,
  //       "uid": "USER-125",
  //       "createdAt": "2023-12-23",
  //       "transactionID": "TXN-003",
  //       "ticketID": "TCKT-003",
  //       "purchaseDate": "2023-12-23",
  //       "seatNumber": "C15",
  //       "status": "active",
  //       "buyerID": "BUYER-003"
  //     },
  //     {
  //       "name": "Food Festival",
  //       "startDate": "2025-05-20",
  //       "endDate": "2025-05-20",
  //       "eventID": "EVT-004",
  //       "tier": "Standard",
  //       "price": 50.00,
  //       "imageUrl": "https://example.com/images/food-festival.jpg",
  //       "scans": 0,
  //       "uid": "USER-126",
  //       "createdAt": "2023-12-23",
  //       "transactionID": "TXN-004",
  //       "ticketID": "TCKT-004",
  //       "purchaseDate": "2023-12-23",
  //       "seatNumber": "12",
  //       "status": "active",
  //       "buyerID": "BUYER-004"
  //     }
  //   ])
  // },[])

  useEffect(() => {
    const ticketNames = tickets && tickets.map((el) => el.name);
    setTicketNames(ticketNames);
    setIsLoading(false);
  }, [tickets]);

  if (isLoading) {
    return <Loading />;
  }

  function handleTicketOnclick(ticket: TicketSchemaType) {
    sessionStorage.setItem("ticket", JSON.stringify(ticket));
    window.location.href = `/ticket/${ticket.ticketID}`;
  }

  return (
    <div
      className={`min-h-screen w-screen ${comfortaa.className} bg-gray-50 flex items-center flex-col`}
    >
      <div className="w-screen flex items-center justify-between p-4 h-[3rem] text-[2rem] text-gray-900">
        <div>My Tickets</div>
        <SheetComponent />
      </div>
      <div className="w-full h-full flex flex-wrap gap-4 items-center justify-center">
        {tickets &&
          tickets.map((el, i) => (
            <div>
              <TicketsListComponents
                handleDelete={handleDelete}
                key={el.ticketID}
                ticketData={el}
                handleTicketOnclick={handleTicketOnclick}
                setTickets={setTickets}
                tickets={tickets}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
