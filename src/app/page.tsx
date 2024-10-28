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
  console.log("fetching data");
  const response = await getDocs(collection(database, "events"));
  const data: EventType[] = [];

  response.forEach((doc) => {
    data.push(doc.data() as EventType);
  });

  console.log(data, "data");

  return data;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EventType[]>();

  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // fetchData().then((data) => {
  //   setData(data);
  //   setIsLoading(false);
  // }
  // ).catch((error) => {
  //   console.error
  // }
  // );

  if (isLoading) {
    return <Loading />;
  }

  return <div>{data && <ListComponent data={data} />}</div>;
}
