import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import EventComponent, { EventType } from "../../components/ui/eventComponent";
import { auth } from "../../firebase.config";
import ListComponent from "../../components/components/listComponent";
import {Comfortaa} from "next/font/google"

export const comfortaa = Comfortaa({
  weight: ["400", "700","300", "500","600"],
  subsets : ["latin", "cyrillic-ext", "vietnamese", "greek"]
})


export default async function Home() {
  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/events",{
      cache: "no-cache",
    });
    const data: EventType[] = await response.json();
    console.log(data);
    return data;
  };

  let data = await fetchData().then((data) => data);

  const list: JSX.Element[] = data.map((event) => (
    <EventComponent event={event} />
  ));

  return <div>{data && <ListComponent data={data} />}</div>;
}
