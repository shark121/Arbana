"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";
import Combobox from "../../../../../components/ui/combobox";
import { Button } from "@/components/ui/button";

export default function EventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
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
    setValueState({ name: eventState?.availableSeats[0].tier })
  }, [eventState]);

  console.log(tierMap);


  let presentState = eventState?.availableSeats.find(seat => seat.tier === valueState?.name)
  console.log(presentState)
  // presentState && console.log(Object.keys(presentState))
  let fields = presentState && Object.keys(presentState).map((element: string, i: number) => {
    return (
      <div key={i}>
        <h1>{presentState[element]}</h1>
      </div>
    )
  })

  console.log(fields)

  function handleOnClick() {
    
   }

  return (
    <div className="flex items-center h-screen w-screen ">
      <div className="relative">
      {valueState && (
        <Combobox
        data={tierMap}
        selected={valueState}
        setSelected={setValueState}
        />
      )}
      </div>
      <div>
        {fields && fields}
      </div>
      <Button onClick={handleOnClick} >
        Book
      </Button>
    </div>
  );
}
