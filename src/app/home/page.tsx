import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import EventComponent, {EventType} from "../../../components/ui/eventComponent";

export default async function Home() {

const fetchData = async () => {
    const response = await fetch("http://localhost:5000/events");
    const data: EventType[] = await response.json();
    console.log(data);
    return data;
};

  let data = await fetchData().then((data) => data)

 const list =  data.map((event) => <EventComponent {...event} />)


  return (
    <div className="h-screen w-screen flex flex-col py-4 items-center gap-4">
      <div>{list}</div>
      <div className="w-[20rem] flex items-center flex-col"></div>
    </div>
  );
}
