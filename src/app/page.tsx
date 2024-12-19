"use client";
import { getCookie } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import EventComponent, { EventType } from "../../components/ui/eventComponent";
import ListComponent from "../../components/ui/listComponent";
import { Comfortaa } from "next/font/google";
import { getDocs, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
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

const searchClient = algoliasearch(
  "W6M4AJCW2Z",
  "d8b19e7a00ef293456a27f59f480e776"
);

function CustomSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div>
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery("");

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search for products"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          autoFocus
        />
        <button type="submit">Submit</button>
        <button
          type="reset"
          hidden={inputValue.length === 0 || isSearchStalled}
        >
          Reset
        </button>
        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  );
}

function Hit({ hit }: { hit: any }) {
  return EventComponent({ event: hit });
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

  useEffect(() => {
    console.log(statusChanged);
  }, [statusChanged]);

  // useEffect(() => {
  //   fetchData()
  //     .then((data) => {
  //       // console.log(data);
  //       setData(data.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // if (isLoading) {
  //   return <Loading />;
  // }

  console.log(process.env.NEXT_PUBLIC_DOMAIN);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <InstantSearch
        searchClient={searchClient}
        indexName="events_index"
      ></InstantSearch>

      <InstantSearch
        searchClient={searchClient}
        indexName="events_index"
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
    </div>
  );

  // return <div>{data && <ListComponent data={data} />}</div>
}
