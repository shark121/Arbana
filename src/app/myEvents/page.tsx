"use client";
import { ArrowLeft, Plus } from "lucide-react";
import { COLORSMAP } from "../../../data/colors";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getDoc, collection, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { database } from "@/firebase.config";
import { EventSchemaType as EventType} from "@/lib/types";
import { useEffect, useState } from "react";
import ScanQRCode from "../scan/[[...data]]/page";
import EventListComponent from "../../../components/components/events/eventComponent";
import { comfortaa } from "../page";
import Loading from "../loading";

export default function MyEvents() {
  const [userID, setUserID] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userState, setUserState] = useState<User>({} as User);
  const [userEvents, setUserEvents] = useState<EventType[]>([]);
  const router = useRouter();
  const userDocsRef = collection(database, "users");

  useEffect(() => {
    const userJSON = JSON.parse(sessionStorage.getItem("user") as string);
    setUserState(userJSON);
  }, []);

  useEffect(() => {
    async function userCreatedEvents() {
      await fetch(`/api/data/read/user_events/`,{
        method: "POST",
        // headers: {
        //   "Content-Type": "apli/plain",
        // },
        body: JSON.stringify({uid: userState.uid}),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUserEvents(data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    
        
    }
    if (userState) {
      userCreatedEvents();
    }

    setIsLoading(false);
  }, [userState]);



  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-w-screen min-h-screen pt-2 flex items-center  flex-col ${comfortaa.className}`}
    >
      <div className="w-full flex items-center h-[3rem] p-2  justify-between">
        <button
        className="w-[2rem] h-[2rem]"
        onClick={() => router.back()}
        >
          <ArrowLeft size={20} color={COLORSMAP.primaryBlue} />
        </button>
        <div className="text-[2rem]">My Events</div>
        <div
          className="w-[1.5rem] h-[1.5rem] bg-primary flex items-center justify-center rounded-full"
          onClick={() => router.push("/myEvents/create")}
        >
          <Plus size={20} color={"white"} />
        </div>
      </div>
      {userEvents && (
        <div className="w-full h-full p-1">
          {userEvents.map((el, i) => (
            <EventListComponent userEvent={el} />
          ))}
        </div>
      )}
      {/* <ScanQRCode/> */}
    </div>
  );
}
