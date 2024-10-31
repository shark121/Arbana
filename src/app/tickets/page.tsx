"use client";
import { useState, useEffect } from "react";
import { TicketType } from "@/lib/types";
import { User } from "firebase/auth";
import Loading from "@/app/loading";
import TicketsListComponents from "../../../components/components/tickets/ticketsListComponent";
import {comfortaa} from "../../app/page";
import SheetComponent from "../../../components/components/sheet";

const fetchTickets = async ({ userID }: { userID: string }) => {
  const res = await fetch(`/api/data/read/bookings/${userID}/stable/s`);
  const data = await res.json();
  console.log(data);
  return data;
};

export default function GetTicket() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [userState, setUserState] = useState<User>();
  const [ticketNames, setTicketNames] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJSON = JSON.parse(sessionStorage.getItem("user") as string);
    setUserState(userJSON);
  }, []);

  useEffect(() => {
    console.log(userState?.uid);
    userState &&
      fetchTickets({ userID: userState.uid }).then((data) => {
        setTickets(data.res);
      });
  }, [userState]);

  useEffect(() => {
    console.log(tickets);
    const ticketNames = tickets && tickets.map((el) => el.name);
    setTicketNames(ticketNames);
    setIsLoading(false);
  }, [tickets]);

  if (isLoading) {
    return <Loading />;
  }

  function handleTicketOnclick(
  
    ticket: TicketType
  ) {

    sessionStorage.setItem("ticket", JSON.stringify(ticket));
    window.location.href = `/ticket/${ticket.ticketID}`;
  }

  return (
    <div className={`min-h-screen w-screen ${comfortaa.className} bg-gray-50 flex items-center flex-col`}>
      <div className="w-full flex items-center justify-between p-4 h-[3rem] text-[2rem] text-gray-900">
        <div>My Tickets</div>
      <SheetComponent/>
      </div>
      {tickets &&
        tickets.map((el, i) => (
          <div
            onClick={(e) =>
              handleTicketOnclick(el)
            }
          >
            <TicketsListComponents key={el.ticketID} ticketData={el} handleTicketOnclick={handleTicketOnclick}/>
          </div>
        ))}
    </div>
  );
}
