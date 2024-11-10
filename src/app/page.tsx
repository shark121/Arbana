"use client";
import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import EventComponent, { EventType } from "../../components/ui/eventComponent";
import ListComponent from "../../components/ui/listComponent";
import { Comfortaa } from "next/font/google";
import { getDocs, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
import Loading from "./loading";

export const comfortaa = Comfortaa({
  weight: ["400", "700", "300", "500", "600"],
  subsets: ["latin", "cyrillic-ext", "vietnamese", "greek"],
});

async function fetchData() {
  return fetch("/api/data/read/events",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "false",
  }).then((response) => response.json());
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EventType[]>();

  useEffect(() => {
    fetchData()
      .then((data) => {
        // console.log(data);
        setData(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <div>{data && <ListComponent data={data} />}</div>;
}
