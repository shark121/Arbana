"use client";
import { useState, useEffect } from "react";
import { TicketSchemaType } from "@/lib/types";
import { User } from "firebase/auth";
import Loading from "@/app/loading";
import TicketsListComponents from "../../../components/components/tickets/ticketsListComponent";
import { comfortaa } from "../../app/page";
import SheetComponent from "../../../components/components/sheet";
import EmptyComponent from "../../../components/components/emptyComponent";
import Cookies from "js-cookie";

const fetchTickets = async ({ userID }: { userID: string }) => {
  const res = await fetch(`/api/data/read/bookings/${userID}`);
  const data = await res.json();
  return data;
};

export default function GetTicket() {
  const [tickets, setTickets] = useState<TicketSchemaType[]>();
  const [userState, setUserState] = useState<User>();
  const [ticketNames, setTicketNames] = useState<string[]>();
  const [loadingBuffer, setLoadingBuffer] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJSON = JSON.parse(Cookies.get("user") || "{}");

    const userExists = Object.keys(userJSON).length > 0;

    if (userExists) {
      setUserState(userJSON);

      userJSON.uid &&
        fetchTickets({ userID: userJSON.uid }).then((data) => {
          console.log(data);
          setTickets([...data.res].reverse());
        });
    } else {
      const ticketsJSON = JSON.parse(
        sessionStorage.getItem("tickets") as "[]"
      ) as TicketSchemaType[];

      if (ticketsJSON) {
        setTickets(ticketsJSON);
      } else {
        setTickets([]);
      }
    }
  }, []);

  async function handleDelete(ticket: TicketSchemaType) {
    console.log("hadling delete........");
    const data = new FormData();
    data.append("ticketData", JSON.stringify(ticket));
    await fetch("/api/data/update/tickets/", {
      body: data,
      method: "POST",
    });

    console.log("handle delete...............");

    tickets &&
      setTickets(tickets.filter((el) => el.ticketID !== ticket.ticketID));
    sessionStorage.setItem(
      "tickets",
      JSON.stringify(tickets?.filter((el) => el.ticketID !== ticket.ticketID))
    );
  }

  useEffect(() => {
    const ticketNames = tickets && tickets.map((el) => el.name);
    setTicketNames(ticketNames);
    setIsLoading(false);
  }, [tickets]);

  setTimeout(() => {
    setLoadingBuffer(false);
  }, 500);

  if (isLoading || loadingBuffer || !tickets) {
    return <Loading />;
  }

  function handleTicketOnclick(ticket: TicketSchemaType) {
    sessionStorage.setItem("ticket", JSON.stringify(ticket));
    window.location.href = `/ticket/${ticket.ticketID}`;
  }

  return (
    tickets && (
      <div
        className={`min-h-screen w-screen ${comfortaa.className} bg-gray-50 flex items-center flex-col`}
      >
        <div className="w-screen flex items-center justify-between p-4 h-[3rem] text-[2rem] text-gray-900 z-10">
          <div>My Tickets</div>
          <SheetComponent />
        </div>
        <div className="w-full h-full flex flex-wrap gap-4 items-center justify-center">
          {tickets && tickets.length == 0 ? (
            <EmptyComponent
              header="You have no tickets"
              subHeader="Purchased tickets will appear here"
            />
          ) : (
            tickets &&
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
            ))
          )}
        </div>
      </div>
    )
  );
}
