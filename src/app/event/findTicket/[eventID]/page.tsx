"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";
import { Button } from "@/components/ui/button";
import Counter from "../../../../../components/components/counter";
import BackSVG from "@/images/svg/back";
import { Comfortaa } from "next/font/google";
import { COLORSMAP } from "../../../../../data/colors";
import { useRouter } from "next/navigation";
import { convertDate } from "../../getEvent/[eventID]/page";
import Image from "next/image";
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type TicketStateType = {
  eventID: string;
  tier: string;
  price: number;
};

// export function TicketComponent({type, key}:{type: EventType, key: number}){
//   return
// }

export default function FindEventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
  const [ticketState, setTicketState] = useState<TicketStateType>();
  const [defaultValueState, setDefaultValueState] = useState(1);
  const [currentTier, setCurrentTier] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(1);
  const router = useRouter();
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
    setCurrentTier(eventState?.availableSeats[0].tier ?? "");
    setCurrentPrice(eventState?.availableSeats[0].price ?? 1);
  }, [eventState]);

  const convertedStartDate = Object.values(convertDate(eventState?.startDate))
    .slice(1)
    .join(" ");
  const convertedEndDate = Object.values(convertDate(eventState?.endDate))
    .slice(1)
    .join(" ");

  
    useEffect(() => {
      setDefaultValueState(1);
    }, [currentTier]);

  const TicketTypes = eventState?.availableSeats.map((type, i) => {

    const isCurrentTier = type.tier === currentTier;
    return (
      <div
        key={i}
        onClick={() => {
          setCurrentTier(type.tier);
          setCurrentPrice(type.price);
          
        }}
        className=" relative flex flex-col items-start  gap-4 w-[90%]  rounded-xl shadow-sm"
      >
        <div
          className={`h-[3rem] w-full top-0 ${isCurrentTier ? "bg-gray-700 text-white" : "text-black"}  items-center justify-start flex rounded-t-2xl  px-4`}
        >
          <div className="font-bold text-[1.1rem]">{type.tier}</div>
        </div>
        <div className="w-full">
          <div className="h-[7rem] p4 flex relative w-full">
            <div className="relative h-[6rem] w-[6rem] mx-1">
              <Image
                fill
                alt="ticket image"
                src={eventState.imageUrl}
                className="rounded"
              />
            </div>
            <div className="p-x w-[60%] flex  flex-col justify-start items-start">
              <div className="font-bold ">{eventState.name}</div>
              <div className="text-[0.8rem] text-gray-500 flex w-full ">
                <div>{`${convertedStartDate}   -   ${convertedEndDate}`}</div>
              </div>
              <div className="font-bold  absolute right-2 bottom-2">
                ${type.price}
              </div>
            </div>
          </div>
        <div className={`w-full h-[60px]  flex items-center justify-end ${!isCurrentTier ? "hidden" : "" }`}>
            <Counter
              max={999}
              id={eventID}
              defaultValue={defaultValueState}
              setDefaultValue={setDefaultValueState}
            />
          </div>
          <div className=""></div>
        </div>
      </div>
    );
  });

  function handleOnClick(eventID: string, tier: string, price: number) {
    sessionStorage.setItem(
      "ticket",
      JSON.stringify({
        name: eventState?.name,
        startDate: eventState?.startDate,
        endDate: eventState?.endDate,
        imageUrl: eventState?.imageUrl,
        eventID,
        tier,
        price,
        quantity: defaultValueState,
      })
    );
    window.location.href = `/booking/${eventID}`;
  }

  // let presentState = eventState?.availableSeats.find(seat => seat.tier === valueState?.name);
  //   console.log(presentState)
  // presentState && console.log(Object.keys(presentState))
  // let fields = presentState && Object.keys(presentState).map((element: string, i: number) => {
  //   return (
  //     <div key={i}>
  //       <h1>{presentState[element]}</h1>
  //     </div>
  //   )
  // })

  // console.log(fields)

  return (
    <div
      className={`flex flex-col h-screen w-screen justicfy-start items-center gap-4 bg-blue-50/15 ${comfortaa.className} `}
    >
      <div className="relative font-bold flex items-center justify-center h-[5rem] w-full text-[1.4rem] ">
        <div className="absolute left-2" onClick={() => router.back()}>
          {<BackSVG height="23px" width="23px" />}
        </div>
        <div>Choose Ticket</div>
      </div>
      {TicketTypes}
      {eventState && (
        <Button
          onClick={() => handleOnClick(eventID, currentTier, currentPrice)}
        >
          Purchase
        </Button>
      )}
    </div>
  );
}
