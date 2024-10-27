"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getDoc, collection, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { database } from "@/firebase.config";
import { EventType } from "@/lib/types";
import { useEffect, useState } from "react";
import ScanQRCode from "../scan/[[...data]]/page";

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



  function handleEventOnclick(event: EventType) {
     window.location.href = `/myEvents/eventOptions/${event.eventId}`;
  }


  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div>
        {userEvents && (
          <div>
            {userEvents.map((el,i) => (
              <button className="w-full h-[2rem]"
              key={i}
              onClick={()=>handleEventOnclick(el)}
              >{el.name}</button>
            ))}
          </div>
        )}
      </div>
      <Button onClick={() => router.push("/myEvents/create")}>
        Create Event
      </Button>
      {/* <ScanQRCode/> */}
      </div>
  );
}
