"use client";
import { useState, useEffect } from "react";
import { TicketSchemaType } from "@/lib/types";
import { User } from "firebase/auth";
import Loading from "@/app/loading";
import TicketsListComponents from "../../../components/components/tickets/ticketsListComponent";
import { comfortaa } from "../../app/page";
import SheetComponent from "../../../components/components/sheet";
import { getCookie } from "@/lib/utils";

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
    // window.location.href = `/ticket/${ticket.ticketID}`;
  }

  return (
    <div
      className={`min-h-screen w-screen ${comfortaa.className} bg-gray-50 flex items-center flex-col`}
    >
      <div className="w-screen flex items-center justify-between p-4 h-[3rem] text-[2rem] text-gray-900">
        <div>My Tickets</div>
        <SheetComponent />
      </div>
      <div className="w-full h-full flex flex-wrap items-center justify-center">
        {tickets &&
          tickets.map((el, i) => (
            <div onClick={(e) => handleTicketOnclick(el)}>
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
