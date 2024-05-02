"use client";
import { generateRandomId } from "../../src/lib/utils";

export type TicketType = {
    tier : string
    number: number;
    price: number;
};

export type EventType = {
  eventId: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  availableSeats: TicketType[];
  level: string;
  categories: string[];
  imageUrl: string;
};

export default function EventComponent(event: EventType) {
  function handleOnClick() {
    const eventInfo = JSON.stringify(event);
    const eventID = generateRandomId(10);
    sessionStorage.setItem(`${event.eventId}`, eventInfo);
    window.location.href = `/event/getEvent/${event.eventId}`;
  }

  return (
    <button onClick={handleOnClick} className="h-[4rem] w-full text-left p-3">
      <h1>{event.name}</h1>
    </button>
  );
}
