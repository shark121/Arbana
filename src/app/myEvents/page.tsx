"use client";
import { ArrowLeft, Plus } from "lucide-react";
import { COLORSMAP } from "../../../data/colors";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getDoc, collection, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { database } from "@/firebase.config";
import { EventType } from "@/lib/types";
import { useEffect, useState } from "react";
import ScanQRCode from "../scan/[[...data]]/page";
import EventListComponent from "../../../components/components/events/eventComponent";
import { comfortaa } from "../page";

export default function MyEvents() {
  const [userID, setUserID] = useState();
  const [userState, setUserState] = useState<User>();
  const [userEvents, setUserEvents] = useState<EventType[]>([]);
  const router = useRouter();
  const userDocsRef = collection(database, "users");

  useEffect(() => {
    const userJSON = JSON.parse(sessionStorage.getItem("user") as string);
    setUserState(userJSON);
  }, []);

  useEffect(() => {
    async function userCreatedEvents() {
      await getDoc(doc(userDocsRef, userState?.uid))
        .then((querySnapshot) => {
          console.log(querySnapshot.data(), "data");
          let data: EventType[] = querySnapshot.data()?.events as EventType[];
          setUserEvents(data);
        })
        .catch((error) => console.log(error));
    }
    if (userState) {
      userCreatedEvents();
    }
  }, [userState]);

  useEffect(() => {
    console.log(userEvents, ".........................");
  }, [userEvents]);

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
