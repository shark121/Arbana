"use client";
import { useEffect, useState } from "react";
// import { EventType } from "../../../../../components/ui/eventComponent";
import {
  EventSchemaType,
  EventSchemaType as EventType,
  TicketSchemaType,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import Counter from "../../../../../components/components/counter";
import BackSVG from "@/images/svg/back";
import { Comfortaa } from "next/font/google";
import { COLORSMAP } from "../../../../../data/colors";
import { useRouter } from "next/navigation";
import { convertDate } from "../../getEvent/[eventID]/page";
import Image from "next/image";
import { User } from "firebase/auth";
import { generateRandomId } from "@/lib/utils";
import SheetComponent from "../../../../../components/components/sheet";
import { ArrowLeft } from "lucide-react";
import Verified from "@/images/svg/verified";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type TicketStateType = {
  eventID: string;
  tier: string;
  price: number;
};

export default function FindEventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventSchemaType>();
  const [ticketState, setTicketState] = useState<TicketStateType>();
  const [defaultValueState, setDefaultValueState] = useState(1);
  const [currentTier, setCurrentTier] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(1);
  const [userInfoState, setUserInfoState] = useState<User>();
  const router = useRouter();
  const eventID = params.params.eventID;

  const tierMap = eventState?.availableSeats.map((seat) => ({
    name: seat.tier,
  }));

  const [valueState, setValueState] = useState<{ name: string }>();

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    eventData && setEventState(JSON.parse(eventData));
    const userInformation = sessionStorage.getItem("user");
    setUserInfoState(JSON.parse(userInformation as string));

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
        className={`relative flex flex-col transition-all duration-300 ease-in-out delay-100 px-4 items-start  gap-4 w-[90%]  rounded-xl shadow-sm ${
          isCurrentTier ? "scale-105" : ""
        } `}
      >
        <div
          className={`h-[3rem] w-full top items-center justify-start flex rounded-t-2xl`}
        >
          <div className="font-bold text-[1.1rem] flex justify-between items-center w-full">
            <div>{type.tier}</div>
            <div>
              {" "}
              {isCurrentTier ? (
                <Verified height="30px" width="30px" bgfill="red" />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="h-[4rem] p4 flex relative w-full">
            {/* <div className="relative h-[6rem] w-[6rem] mx-1">
              <Image
                fill
                alt="ticket image"
                src={eventState.imageUrl}
                className="rounded"
              />
            </div> */}
            <div className="p-x w-[80%] flex  flex-col justify-start items-start">
              {/* <div className="font-bold ">{eventState.name}</div> */}
              <div className="text-[0.8rem] text-gray-500 font-thin flex flex-col w-full ">
                <div>{`${convertedStartDate}   •   ${convertedEndDate}`}</div>
                <div>{eventState?.location}</div>

                {/* <div>{eventState.time}</div> */}
              </div>
              <div className="font-bold  absolute right-2 bottom-2">
                ${type.price}
              </div>
            </div>
          </div>
          <div
            className={`w-full h-[60px]  flex items-center justify-end ${
              !isCurrentTier ? "hidden" : "hidden"
            }`}
          >
            {/* <Counter
              max={999}
              id={eventID}
              defaultValue={defaultValueState}
              setDefaultValue={setDefaultValueState}
            /> */}
          </div>
          <div className=""></div>
        </div>
      </div>
    );
  });

  function handleOnClick(eventID: string, tier: string, price: number) {


    const ticeketData: Omit<TicketSchemaType, "transactionID">  = {
      name: eventState!.name,
      startDate: eventState!.startDate,
      endDate: eventState!.endDate,
      imageUrl: eventState!.imageUrl,
      eventID,
      tier,
      price,
      scans: defaultValueState,
      createdAt: new Date().toISOString(),
      uid: userInfoState?.uid || generateRandomId(6),
      ticketID: generateRandomId(10),
    };

    sessionStorage.setItem("ticket", JSON.stringify(ticeketData));
    window.location.href = `/booking/${eventID}`;
  }

  return (
    <div
      className={`flex flex-col h-screen w-screen justicfy-start items-center gap-4 bg-blue-50/15 ${comfortaa.className} `}
    >
      <div className="relative font-bold flex items-center justify-between p-2 h-[5rem] w-full text-[1.4rem] ">
        <div className="" onClick={() => router.back()}>
          <ArrowLeft color={COLORSMAP.black} />
        </div>
        <div>Choose Ticket</div>
        <SheetComponent />
      </div>
      {TicketTypes}
      {eventState && (
        <Button
          onClick={() =>
            eventState && handleOnClick(eventID, currentTier, currentPrice)
          }
        >
          Purchase
        </Button>
      )}
    </div>
  );
}
