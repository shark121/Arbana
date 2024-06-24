"use client";
import LocationSVG from "@/images/svg/location";
import { generateRandomId } from "../../src/lib/utils";
import Image from "next/image";

export type TicketType = {
  tier: string;
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

export default function EventComponent({ event }: { event: EventType }) {
  function handleOnClick() {
    const eventInfo = JSON.stringify(event);
    const eventID = generateRandomId(10);
    sessionStorage.setItem(`${event.eventId}`, eventInfo);
    window.location.href = `/event/getEvent/${event.eventId}`;
  }

  const startDateToObject = new Date(event.startDate);
  const startDateToString = startDateToObject.toDateString();

  return (
    <button
      onClick={handleOnClick}
      className="h-[8rem]  w-[95%] text-ellipsis text-[0.9rem] shadow-sm rounded-2xl flex items-center bg-white px-3  "
    >
      <div className="relative h-[6.5rem] w-[6.5rem] rounded-2xl place-self-center">
        <Image
          src={event.imageUrl}
          alt="event image"
          fill
          className="rounded-2xl object-cover "
        />
      </div>
      <div className="text-left p-2 flex flex-col gap-2 w-[65%]">
        <div className="font-bold  ">
          {event.name.length > 30
            ? event.name.slice(0, 35) + "..."
            : event.name}
        </div>
         <div className="flex flex-col gap-2">
          <div>{startDateToString.split(" ").join(" • ")}</div>
          <div className="flex h-[1rem] ">
            <div className="h-[1rem] w-[1rem] flex items-center justify-center">
              <LocationSVG fill="#371fef" height="13px" width="13px" />
            </div>
            {event.location.length > 20 ? " " +  event.location.slice(0,20) + "...":" " +  event.location}
          </div>
        </div>
      </div>
    </button>
  );
}
