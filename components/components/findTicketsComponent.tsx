"use client";
import { useEffect, useState } from "react";
import { EventType } from "../ui/eventComponent";
// import Combobox from "../../../../../components/ui/combobox";
import { Button } from "@/components/ui/button";
import Counter from "../ui/counter";
import { COLORSMAP } from "../../data/colors";

type TicketStateType = {
  eventID: string;
  tier: string;
  price: number;
};

export default function FindEventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
  const [ticketState, setTicketState] = useState<TicketStateType>();
  const eventID = params.params.eventID;

  const tierMap = eventState?.availableSeats.map((seat) => ({
    name: seat.tier,
  }));

  const [valueState, setValueState] = useState<{ name: string }>();

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    eventData && setEventState(JSON.parse(eventData));
    console.log(eventData);
  }, []);

  useEffect(() => {
    setValueState({ name: eventState?.availableSeats[0].tier ?? "" });
  }, [eventState]);

  const TicketTypes = eventState?.availableSeats.map((type, i) => {
    return (
      <button
        key={i}
        onClick={() => handleOnClick(eventID, type.tier, type.price)}
        className="flex relative gap-4 h-[4rem]  w-full  justify-start p-4 shadow-sm"
      >
        <div className="font-bold text-[1.2rem]">{type.tier}</div>
        <div className={`absolute right-4 bottom-2 h-[2rem] min-w-[5rem] text-white bg-[#7CFC00] flex items-center justify-center rounded-lg`}>{type.price}</div>
      </button>
    );
  });

  function handleOnClick(eventID: string, tier: string, price: number) {
    sessionStorage.setItem(
      "ticket",
      JSON.stringify({
        name: eventState?.name,
        date: eventState?.startDate,
        eventID,
        tier,
        price,
      })
    );
    window.location.href = `/booking/${eventID}`;
  }

  return (
    <div className="flex flex-col h-full w-screen justify-center items-center gap-4 ">
      <div className="font-bold  w-full h-[3rem] px-4 text-[1.4rem]">Ticket Prices</div>
      {TicketTypes}
    </div>
  );
}
