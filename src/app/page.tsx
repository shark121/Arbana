"use client";
import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";
import EventComponent, { EventType } from "../../components/ui/eventComponent";
import ListComponent from "../../components/ui/listComponent";
import { Comfortaa } from "next/font/google";
import { getDocs, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
import Loading from "./loading";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  Pagination,
  Configure,
} from 'react-instantsearch';
import { configDotenv } from "dotenv";
import path from "path"

// configDotenv({path:"../.env", debug:true})

// configDotenv({ path: path.resolve(__dirname, "./env") ,  debug : true,  });

console.log(process.env.DOMAIN)

const searchClient = algoliasearch('SMBZHKSMJI', 'dce58c7cd0e034fa1e098908f9f61c8c');

function Hit({ hit }:{hit: any}) {
  console.log(hit);
  return (
    <article>
      <img src={hit.image} alt={hit.name} />
      <h1>{hit.title}</h1>
      {/* <p>{hit}</p>
      <h1>{hit.name}</h1>
      <p>${hit.price}</p> */}
    </article>
  );
}


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

  console.log(process.env.NEXT_PUBLIC_DOMAIN)

  return <div>{data && <ListComponent data={data} />}</div>


   

// ...

  return (
    <InstantSearch searchClient={searchClient} indexName="movies_index" insights>
      <Configure hitsPerPage={40} />
      <SearchBox />
      <RefinementList attribute="brand" />
      <Hits hitComponent={Hit} />
      <Pagination />
    </InstantSearch>
  );
}
