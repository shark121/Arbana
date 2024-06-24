"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BackSVG from "@/images/svg/back";
import ShareSVG from "@/images/svg/share";
import { COLORSMAP } from "../../../../../data/colors";
import { Comfortaa } from "next/font/google";
import { Calendar } from "lucide-react";
import DateSVG from "@/images/svg/date";
import MapComponent from "../../../../../components/components/map";
import LocationSVG from "@/images/svg/location";
import FindEventItem from "../../../../../components/components/findTicketsComponent";
import { DaysOfTheWeek } from "../../../../../data/days";

const comfortaa = Comfortaa({
  weight: ["400", "700", "300", "500"],
  subsets: ["cyrillic-ext", "greek"],
});

type DateMapType = {
  month: string;
  dayOfWeek: string;
  day: string;
  year: string;
};

export function convertDate(date: string | undefined): DateMapType {
  const dateMap: DateMapType = {
    dayOfWeek: "",
    month: "",
    day: "",
    year: "",
  };

  if (!date) return dateMap;
  const newDate = new Date(date);
  const dateToString = newDate.toDateString();

  const datesArray = dateToString.split(" ");
  dateMap["month"] = datesArray[1];
  dateMap["dayOfWeek"] = DaysOfTheWeek[datesArray[0]];
  dateMap["day"] = datesArray[2];
  dateMap["year"] = datesArray[3];
  return dateMap;
}

export default function EventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
  const [displayTickets, setDisplayTickets] = useState(false);
  const eventID = params.params.eventID;


  const convertedDate = convertDate(eventState?.startDate);

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    eventData && setEventState(JSON.parse(eventData));
    console.log(eventData);
  }, []);

  useEffect(() => {
    console.log(eventState);
  }, [eventState]);

  function handleOnClick() {
    window.location.href = `/event/findTicket/${eventID}/`;
    // setDisplayTickets(!displayTickets);
  }

  //  return(
  //   <div className={`${comfortaa.className} w-screen min-h-screen`}>
  //     <div className="h-[50rem] bg-yellow-200 w-screen"></div>
  //   </div>
  //  )

  return (
    <div
      className={`w-full items-center  flex-col  text-black ${comfortaa.className} pb-20 bg-gray-50/10`}
    >
      <div className="w-full h-[3.5rem]  flex items-center justify-between p-4">
        <button>
          <BackSVG height="20px" width="20px" />
        </button>
        <div>
          <ShareSVG height="20px" width="20px" fill={COLORSMAP.primaryBlue} />
        </div>
      </div>
      <div className="h-[20rem] w-screen  flex flex-col justify-between items-center px-2">
        <div className="relative w-[95%] h-[15rem] rounded-2xl my-2">
          {eventState && (
            <Image
              src={eventState?.imageUrl}
              fill
              alt="event image"
              className="rounded-2xl"
            />
          )}
        </div>
        <div className="font-bold text-[1.2rem] px-8 text-center">
          {eventState?.name}
        </div>
        <div className="h-[2rem] flex w-full items-center justify-center gap-1">
          <div className=" ">{<LocationSVG height="17px" width="17px" fill={COLORSMAP.primaryBlue}/>}</div>
          <div>{eventState?.location}</div>
        </div>
        {/* <div className="flex h-[2rem] items-center justify-center w-full gap-2">
          <div className="flex items-center justify-center h-full w-[1rem]">
            <DateSVG height="15px" width="15px" fill={COLORSMAP.primaryBlue} />
          </div>
          <div className="flex items-center justify-center my-2 flex-col">
            {eventState && convertDate(eventState.startDate)[0]}
            <div>9:00pm GMT</div>
          </div>
        </div> */}
      </div>
      <div>
        <div className="h-[6rem]  flex items-center text-gray-600 px-6 gap-4 bg-white rounded-lg">
          <div className="h-[4rem] w-[4rem] bg-gray-100 flex items-center justify-center font-bold text-[1.5rem] rounded-lg flex-col">
            <div>{convertedDate.day}</div>
            <div className="font-normal text-[0.9rem]">
              {convertedDate.month}
            </div>
          </div>
          <div className="h-[4rem] w-[10rem]  flex items-start justify-center p-4 font-bold text-[1.5rem] rounded-lg flex-col">
            <div>{convertedDate.dayOfWeek}</div>
            <div className="text-[0.9rem] font-normal">9:00 GMT</div>
          </div>
        </div>
        <div className="px-6 flex flex-col item-center justify-center">
          <div className="font-semibold text-[1.2rem]">About</div>
          <div>{eventState?.description}</div>
        </div>
      </div>
      {/* {!displayTickets ? (
        <div className=" w-screen px-8 my-2 ">
          <div className="w-full text-[0.9rem] my-2 `font-bold text-left ">
            About Event
          </div>
          <div className="text-[0.85rem] mb-6">{eventState?.description}</div>
          <div className={`w-full h-[25rem] rounded-[1rem] mt-2`}>
            <div>
              <div className="h-[4rem] w-full flex flex-col">
                <div className="font-bold">Location</div>
                <div className="flex h-full w-full items-center justify-start gap-2">
                  <LocationSVG
                    height="15px"
                    width="15px"
                    fill={COLORSMAP.primaryBlue}
                  />
                  <div>{eventState?.location}</div>
                </div>
              </div>
            </div>
            <div className="h-[20rem] w-full relative flex flex-col ">
              <div className="rounded-b-lg h-full w-full ">
                <MapComponent
                  width={"100%"}
                  height={"100%"}
                  defaultZoom={15}
                  defaultCenter={{ lat: 38.875183, lng: -77.413843 }}
                />
              </div>
            </div>
          </div>
        </div>
      )
      :  <FindEventItem params={{eventID :`${eventState?.eventId}` || ""}}/>
      } */}
      <div className=" h-[4rem] w-screen fixed bottom-0 left-0 right-0 flex items-center justify-center bg-white">
        <button
          className="h-[3rem] w-[20rem] bg-blue-600 rounded-xl text-white font-bold"
          onClick={() => handleOnClick()}
        >
          {displayTickets ? "book ticket" : "find ticket"}
        </button>
      </div>
    </div>
  );
}
