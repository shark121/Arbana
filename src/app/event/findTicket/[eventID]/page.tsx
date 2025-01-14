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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { convertDate } from "../../getEvent/[eventID]/page";
import Image from "next/image";
import { User } from "firebase/auth";
import { generateRandomId } from "@/lib/utils";
import SheetComponent from "../../../../../components/components/sheet";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { motion as m } from "framer-motion";
import Verified from "@/images/svg/verified";
import Loading from "@/app/loading";

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
  const [loadingBuffer, setLoadingBuffer] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const eventID = params.params.eventID;

  const tierMap = eventState?.availableSeats.map((seat) => ({
    name: seat.tier,
  }));

  const [valueState, setValueState] = useState<{ name: string }>();

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    eventData && setEventState(JSON.parse(eventData));
    // const userInformation = sessionStorage.getItem("user");
    const userInformation = Cookies.get("user");

    if (userInformation)
      setUserInfoState(JSON.parse(userInformation as string));

    console.log(eventData);
  }, []);

  useEffect(() => {
    eventState &&
      setValueState({ name: eventState?.availableSeats[0].tier ?? "" });
    eventState && setCurrentTier(eventState?.availableSeats[0].tier ?? "");
    eventState && (eventState?.availableSeats[0].price ?? 1);
    eventState && setIsLoading(false);
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
      eventState && (
        <div
          key={i}
          onClick={() => {
            setCurrentTier(type.tier);
            setCurrentPrice(type.price);
          }}
          className={`relative flex flex-col transition-all duration-300 bg-white ease-in-out delay-100 p-2 items-start shadow-sm gap-4 w-[90%]  rounded-xl ${
            isCurrentTier ? "scale-105" : ""
          } `}
        >
          {/* <div className="absolute inset-0 bg-black -z-10 translate-x-2 translate-y-2 rounded-lg" /> */}

          <div
            className={`h-[3rem] w-full top items-center justify-start flex rounded-t-2xl`}
          >
            <div className="font-bold text-[1rem] flex justify-between items-center w-full">
              <div className="h-full w-full items-center justify-center">
                {type.tier}
              </div>
              <div>
                {" "}
                {isCurrentTier ? (
                  <m.div
                    initial={{ opacity: 0, x: 20, rotate: 60 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.3 }, rotate: 0 }}
                  >
                    <Verified height="30px" width="30px" bgfill="red" />
                  </m.div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="w-full #h-[4.5rem]">
            <div className="#h-[4rem] flex relative w-full">
              <div className="p-x w-full flex  flex-col justify-start items-start h-full">
                <div className="font-thin flex flex-col gap-2 w-full text-xs">
                  <div className="text-gray-500 ">{`${convertedStartDate}   •   ${convertedEndDate}`}</div>
                  <div className="text-gray-500 ">{eventState?.location}</div>
                  <div className="font-bold text-[1rem] w-full flex items-center justify-between">
                    <div>${type.price}</div>
                    {isCurrentTier ? (
                      <div
                        // initial={{ opacity: 0, y: 100 }}
                        // animate={{
                        //   opacity: 1,
                        //   y: 0,
                        //   transition: { delay: 0.5 },
                        // }}
                        className={`w-full h-[30px] flex items-center justify-end`}
                      >
                        <Counter
                          max={999}
                          id={eventID}
                          defaultValue={defaultValueState}
                          setDefaultValue={setDefaultValueState}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className=""></div>
          </div>
        </div>
      )
    );
  });

  function handleOnClick(eventID: string, tier: string, price: number) {
    const ticeketData: Omit<TicketSchemaType, "transactionID"> = {
      name: eventState!.name,
      startDate: eventState!.startDate,
      endDate: eventState!.endDate,
      imageUrl: eventState!.imageUrl,
      eventID,
      tier,
      price,
      scans: defaultValueState,
      quantity: defaultValueState,
      createdAt: new Date().toISOString(),
      uid: userInfoState?.uid || "anon_" + generateRandomId(6),
      ticketID: generateRandomId(10),
    };

    sessionStorage.setItem("ticket", JSON.stringify(ticeketData));
    window.location.href = `/booking/${eventID}`;
  }

  setTimeout(() => {
    setLoadingBuffer(false);
  }, 500);

  if (isLoading || loadingBuffer) return <Loading />;

  return (
    <div
      className={`flex flex-col h-screen w-screen justicfy-start items-center gap-4 bg-blue-50/15 ${comfortaa.className} `}
    >
      <div className="relative font-bold flex items-center justify-between p-2 h-[5rem] w-full text-[1.4rem] ">
        <div className="" onClick={() => router.back()}>
          <ChevronLeft color={"red"} />
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
