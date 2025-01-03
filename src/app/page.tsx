"use client";
import { getCookie } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import EventComponent from "../../components/ui/eventComponent";
import { Comfortaa } from "next/font/google";
import { EventSchemaType as EventType } from "@/lib/types";
import Loading from "./loading";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
  Hits,
  Highlight,
  RefinementList,
  Pagination,
  Configure,
} from "react-instantsearch";
import Search from "../../components/ui/searchBar";
import AlgoSearch from "../../components/components/algosearch";
import Verified from "@/images/svg/verified";
import SheetComponent from "../../components/components/sheet";
import { useScroll } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const searchClient = algoliasearch(
  "W6M4AJCW2Z",
  "d8b19e7a00ef293456a27f59f480e776"
);



// function CustomSearchBox(props: UseSearchBoxProps) {
//   let divs = [];
//   let colors: string[] = ["blue", "yellow", "gray", "red"];
//   let select: string[] = [];

//   for (let i = 0; i < 100; i++) {
//     select.push(colors[Math.floor(Math.random() * colors.length)]);
//   }

//   // for (let i: number = 0; i < 20; i++) {
//   //   divs.push(<div className={`h-20 w-full bg-red- my-4`}></div>);
//   // }

//   const event: EventType = {
//     eventId: 1,
//     name: "AfroPiano Concert ",
//     startDate: "2022-01-01",
//     endDate: "2022-01-01",
//     time: "12:00",
//     location: "Oforikrom, Ashanti AfroPiano Concert",
//     description: "description",
//     availableSeats: [],
//     categories: ["categories"],
//     imageUrl:
//       "https://s3.amazonaws.com/thumbnails.venngage.com/template/cce90b70-55d5-492c-9e8d-0264f5b62734.png",

//     createdAt: "2022-01-01",
//     userID: "userID",
//     imageFile: "imageFile",
//     mobile: "+233 123 456 789",
//     creator: {
//       name: "creator",
//       email: "email",
//       verified: true, 
//       uid: "uid",     
//     },
//     province: "province",
    
//   };

//   for (let i: number = 0; i < 100; i++) {
//     divs.push(<EventComponent event={event} />);
//   }
//   return (
//     <div className="relative w-screen h-screen flex items-center justify-center flex-col">
//       <div className="backdrop-blur-md bg-gray-100 -translate-x-1/2 sticky z-20 h-[60px] w-[15rem] rounded-full top-8 inset-x-[50%] flex items-center justify-between p-4">
//         <input className="bg-inherit outline-none h-full w-[90%] text-gray-600"></input>
//         <Verified height="30px" width="30px" bgfill="#ED191D" />
//       </div>
//       {/* <div className="p-6 bg-white/55 sticky z-30 backdrop-blur-lg rounded-lg shadow-lg w-96">
//         {" "}
//       </div> */}
//       {...divs}
//       {/* <div className="z-10 w-[calc(100vw-48px)] rounded-28 bg-[hsla(0,0%,93%,0.72)] backdrop-blur-xl"></div> */}
//     </div>
//   );
// }

function Hit({ hit }: { hit: any }) {
  return <div className="w-screen h-full">
    {EventComponent({ event: hit })}
  </div>
    
}


export const comfortaa = Comfortaa({
  weight: ["400", "700", "300", "500", "600"],
  subsets: ["latin", "cyrillic-ext", "vietnamese", "greek"],
});

async function fetchData() {
  return fetch("/api/data/read/events", {
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
  const [value, setValue] = useState<EventType | null>(null);
  const [statusChanged, setStatusChanged] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const {toast} = useToast()

  

  

  return (
    <div className="flex flex-col relative items-center bg-white justify-center h-full w-full">
      {/* <InstantSearch
        searchClient={searchClient}
        indexName="events_index"
        insights
      ></InstantSearch> */}
      {/* <Button 
       onClick={() => {
        // console.log("clicked")
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        })
      }}
      >click</Button> */}

      <InstantSearch
        searchClient={searchClient}
        indexName="events_index"
        onStateChange={()=>console.log("state changed")}
        insights
      >
        <AlgoSearch
          setStatusChanged={setStatusChanged}
          statusState={statusChanged}
        />

        <Configure hitsPerPage={40} />
        <RefinementList attribute="name" />
        <Hits hitComponent={Hit} className="w-full h-full" />
      </InstantSearch>
      {/* <CustomSearchBox /> */}
    </div>
  );
}
