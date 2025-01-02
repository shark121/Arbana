"use client";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import Map from "../../../../components/components/mapComponents/map";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { set } from "date-fns";

const libs: Libraries = ["places"];

function MapPage(context: { params: { data: string } }) {
  const [eventData, setEventData] = useState("");
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
  const eventID = context.params.data;

  console.log(eventID);

  useEffect(() => {
    const event = sessionStorage.getItem(eventID) as string;
    const eventData = JSON.parse(event);
    console.log(eventData);
    setLatLng({ lat: eventData.locationCoordinates.lat, lng: eventData.locationCoordinates.lng });
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  if (!isLoaded) return <Loading />;

  return <Map latLng={latLng}/>;
}

export default MapPage;
