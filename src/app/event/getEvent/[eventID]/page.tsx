"use client";
import { useEffect, useState } from "react";
import { EventType } from "../../../../../components/ui/eventComponent";

export default function EventItem(params: { params: { eventID: string } }) {
  const [eventState, setEventState] = useState<EventType>();
  const eventID = params.params.eventID;

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
  }

  return (
    <div>
      <h1>{eventState?.name}</h1>
      <h1>{eventState?.startDate}</h1>
      <h1>{eventState?.location}</h1>
      <h1>{eventState?.endDate}</h1>
      <h1>{eventState?.description}</h1>
      <div className="flex flex-col gap-3">
      <button onClick={handleOnClick}>find tickets</button>
        {/* {eventState &&
          eventState.availableSeats.map((seat, i) => (
            <div className="" key={i}>
              <h1>{seat.number}</h1>
              <h1>{seat.price}</h1>
              <h1>{seat.tier}</h1>
              <button>Buy</button>
            </div>
          ))} */}
      </div>
    </div>
  );
}
