"use client";
import { useState, useEffect } from "react";
import { TicketType } from "@/lib/types";
import { User } from "firebase/auth";

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
  }, [tickets]);

  return (
    <div className="min-h-screen w-screen">
      {tickets &&
        tickets.map((el, i) => (
          <button
            key={i}
            onClick={() => {
              sessionStorage.setItem("ticket", JSON.stringify(el));

              window.location.href = `/ticket/${el.ticketID}`;
            }}
          >
            {el.name}
          </button>
        ))}
    </div>
  );
}
