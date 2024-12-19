"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BackSVG from "@/images/svg/back";
import ShareSVG from "@/images/svg/share";
import { COLORSMAP } from "../../../../../data/colors";
import { Comfortaa } from "next/font/google";
// import { Calendar } from "lucide-react";
import DateSVG from "@/images/svg/date";
import Clock from "@/images/svg/clock";
import MapComponent from "../../../../../components/components/map";
import LocationSVG from "@/images/svg/location";
import FindEventItem from "../../../../../components/ui/findTicketsComponent";
import { DaysOfTheWeek } from "../../../../../data/days";
import { useRouter } from "next/navigation";
import SheetComponent from "../../../../../components/components/sheet";
import { ChevronLeft, CalendarFold as Calendar } from "lucide-react";
import Loading from "@/app/loading"
// import {} from "lucide-react";

async function fetchEventData(
  eventID: string,
  setEventState: React.Dispatch<React.SetStateAction<EventType | undefined>>
) {
  console.log("getting from cache");
  await fetch(`/api/data/read/events/`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "text/plain",
    // },
    body: eventID,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setEventState(data.data);
      sessionStorage.setItem(eventID, JSON.stringify(data.data));
    })
    .catch((error) => {
      console.error(error);
    });
}

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
  const router = useRouter();
  const [eventState, setEventState] = useState<EventType>();
  const [displayTickets, setDisplayTickets] = useState(false);
  const eventID = params.params.eventID;
  const [loading, setLoading] = useState(true);

  const convertedDate = convertDate(eventState?.startDate);

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    console.log(eventID, "event ID");
    console.log(eventData, "event Data/....");
    console.log(typeof eventData);

    if (!eventData) {
      // setEventState(JSON.parse(eventData));
      console.log("event not found");
      fetchEventData(eventID, setEventState);
    } else {
      eventData && setEventState(JSON.parse(eventData));
    }

    // console.log(eventData);
  }, []);

  useEffect(() => {
    console.log(eventState);
    if (eventState) {
      setLoading(false);
    }
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`${comfortaa.className} w-full min-h-full flex flex-col items-center justify-between `}
    >
      <div className="w-full h-[3.5rem]  flex items-center justify-end p-4">
        {/* <button onClick={() => router.back()}
          className="h-[2rem] w-[2rem] rounded-full bg-primary flex items-center justify-center"
          >
          <BackSVG height="20px" width="20px" fill="#fff" />
          <ChevronLeft height="20px" width="20px" fill="none" stroke="white"/>
        </button> */}
        <div>
          {/* <ShareSVG height="20px" width="20px" fill={COLORSMAP.primaryBlue} /> */}
          <SheetComponent />
        </div>
      </div>
      <div className="h-[25rem] w-full  flex flex-col justify-between items-center px-2">
        <div className="relative w-[95%] sm:w-[35rem] h-[20rem] rounded-2xl my-2">
          {eventState && (
            <Image
              src={eventState?.imageUrl}
              fill
              alt="event image"
              className="rounded-2xl"
            />
          )}
        </div>
        <div className="font-bold text-[1.4rem] px-8 text-center">
          {eventState?.name}
        </div>
        {/* <div className="flex">
          {eventState &&
            eventState.categories.map((category) => (
              <div className="flex mx-1 bg-primary px-2 text-white rounded-sm h-[1rem] text-[0.8rem]">
                {category}
              </div>
            ))}
        </div> */}
      </div>
      <div className="min-w-[10rem]">
        <div className=" mx-2 mb-4 rounded-[2rem] shadow-sm  flex flex-col items-center scale-[0.9]">
          <div className="flex h-[6rem] items-center justify-start w-full gap-2  mx-2 box-border my-4 ">
            <div className="flex items-center justify-center w-[3rem] h-[3rem] rounded-full mx-4 p-[0.5rem] bg-blue-50">
              {/* <DateSVG
                height="100%"
                width="100%"
                fill={COLORSMAP.primaryBlue}
              /> */}
              {/* <LocationSVG
                height="70%"
                width="70%"
                fill={COLORSMAP.primaryBlue}
              /> */}
              <Calendar
                height="70%"
                width="70%"
                fill={COLORSMAP.primaryBlue}
                stroke="blue"
              />
            </div>
            <div className="flex items-start justify-start  my-2 flex-col">
              {eventState && convertDate(eventState?.startDate).dayOfWeek}{" "}
              {eventState && convertDate(eventState?.startDate).month}{" "}
              {eventState && convertDate(eventState?.startDate).day}
              {", "}
              {"2024"}
              <div>
                <div className="h-[2rem] w-[10rem]  rounded-xl flex items-center justify-between ">
                  {/* <Clock height="30px"  width="30px" stroke={"#fff"}/> */}
                  <div className=" h-full w-[6rem] flex items-start justify-start  font-bold">
                    {eventState?.time ?? "0:00 GMT"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="outline outline-1 outline-blue-100 rounded-full min-w-[90%] place-self-center"></div>
          <div className="flex h-[6rem] items-center justify-start w-full gap-2  mx-2 my-4 ">
            <div className="flex items-center justify-center w-[3rem] h-[3rem] rounded-full mx-4 p-[0.5rem] bg-blue-50">
              <LocationSVG
                height="70%"
                width="70%"
                fill={COLORSMAP.primaryBlue}
              />
            </div>
            <div className="flex items-start justify-start  my-2 flex-col">
              <div>{eventState?.location}</div>
              <div>
                <div className="h-[2rem] w-[10rem]  rounded-xl flex items-center justify-between ">
                  <div className=" h-full w-[6rem] flex items-start justify-start  font-bold">
                    Province
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 flex flex-col item-center justify-center">
          <div className="font-semibold text-[0.9rem]">About</div>
          <div className="text-[0.8rem]">{eventState?.description}</div>
        </div>
      </div>
      <div className=" h-[4rem] w-full flex items-center justify-center bg-white">
        <button
          className="h-[3rem] w-[20rem] bg-blue-600 rounded-xl text-white font-bold"
          onClick={() => handleOnClick()}
        >
          {"find ticket"}
        </button>
      </div>
    </div>
  );
}
