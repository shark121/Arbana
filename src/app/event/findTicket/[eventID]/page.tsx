"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";
import Combobox from "../../../../../components/ui/combobox";

export default function EventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
  const eventID = params.params.eventID;

  const tierMap = eventState?.availableSeats.map((seat) => ({
    name: seat.tier,
  }));

  const [valueState, setValueState] = useState<{ name: string }>({name:"select tier"});

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    eventData && setEventState(JSON.parse(eventData));
    console.log(eventData);
  }, []);

  useEffect(() => {
    console.log(eventState);
  }, [eventState]);

  console.log(tierMap);

  function handleOnClick() {}

  return (
    <div>
      {/* <h1>{eventState?.name}</h1>
      <h1>{eventState?.startDate}</h1>
      <h1>{eventState?.location}</h1>
      <h1>{eventState?.endDate}</h1>
      <h1>{eventState?.description}</h1> */}
      {tierMap && (
        <Combobox
          data={tierMap}
          selected={valueState}
          setSelected={setValueState}
        />
      )}
      <div className="flex flex-col gap-3">
        {eventState &&
          eventState.availableSeats.map((seat, i) => (
            <div className="w-full" key={i}>
              <h1>{seat.number}</h1>
              <h1>{seat.price}</h1>
              <h1>{seat.tier}</h1>
              <button>Buy</button>
            </div>
          ))}
      </div>
    </div>
  );
}
