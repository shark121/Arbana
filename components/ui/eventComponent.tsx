"use client";
import LocationSVG from "@/images/svg/location";
import { generateRandomId } from "../../src/lib/utils";
import Image from "next/image";
import { motion as m } from "framer-motion";
import { EventSchemaType } from "@/lib/types";
export type TicketType = {
  tier: string;
  number: number;
  price: number;
};

type EventType = EventSchemaType & { imageFile: any };
// export type EventType = {
//   eventId: number;
//   name: string;
//   startDate: string;
//   endDate: string;
//   time : string;
//   location: string;
//   description: string;
//   availableSeats: TicketType[];
//   level?: string;
//   categories: string[];
//   imageUrl: string;
//   creatorMailAdress?:string | null |undefined
//   createdAt?: string;
//   fallBackMailAdress?: string;
//   userID: string;
//   imageFile : any
// };

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
    <m.button
      onClick={handleOnClick}
      className="min-h-[5rem]  w-[95%] text-ellipsis text-[0.9rem] text-gray-700 border-b-[1px] flex items-start bg-white my-1 p-4   justify-start"
    >
      <div className="relative min-h-[5rem] w-[5rem] mr-2 rounded-xl flex items-center justify-center ">
        <Image
          src={event.imageUrl}
          alt="event image"
          fill
          className="rounded-xl object-cover "
        />
      </div>
      <div className="text-left p-0 flex flex-col gap-2 w-[65%] ">
        <div className="text-lg">
          {event.name.length > 30
            ? event.name.slice(0, 35) + "..."
            : event.name}
        </div>
        <div className="flex flex-col gap-1 text-[0.7rem]">
          <div>{startDateToString.split(" ").join(" • ")}</div>
          <div className="flex h-[1rem] ">
            <div className="h-[1rem] w-[1rem] hidden  items-center justify-center">
              {/* <LocationSVG fill="#371fef" height="13px" width="13px" />
               */}
            </div>
            {/* {event.location.length > 20
              ? " " + event.location.slice(0, 20) + "..."
              : " " + event.location} */}
            <div className="text-gray-500 text-[0.8rem]">
              {/* {event.time}{", "} */}
              {"     "} 
              {event.location}
            </div>
          </div>
        </div>
      </div>
    </m.button>
  );
}
