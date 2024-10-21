"use client";
import { useState, useEffect } from "react";
import { TicketType } from "@/lib/types";

export default function GetTicket() {
  const [tickets, setTickets] = useState<TicketType[]>([]);

  useEffect(() => {
    async () => {
      await fetch("/api/data/get/tickets")
        .then((res) => res.json())
        .then((data) => {
          setTickets(data);
        })
        .catch((error) => console.log(error));
    };
  });

  return (
    <div className="min-h-screen w-screen">
      <h1>Get Ticket</h1>
    </div>
  );
}
