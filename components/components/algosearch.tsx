import React, { useState, useRef } from "react";
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";

import { useEffect } from "react";

import { comfortaa } from "@/app/page";

export default function AlgoSearch(
  {
    statusState,
    setStatusChanged,
  }: {
    statusState: boolean;
    setStatusChanged: React.Dispatch<React.SetStateAction<boolean>>;
  },
  props: UseSearchBoxProps
) {
  const { query, refine, clear } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  useEffect(() => {
    setStatusChanged(!statusState);
  }, [status]);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div className="flex h-[3rem] w-[15rem] items-center justify-center rounded-[2rem] m-[1rem] px-2  py-2 bg-gray-100 ring-primary ">
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
          document.body.style.zoom = "100%"

        //   window.resizeTo(window.screen.availWidth , window.screen.availHeight)
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
          className="outline-none bg-inherit "
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
        {/* <button type="submit">Submit</button> */}
        {/* <button
          type="reset"
          hidden={inputValue.length === 0 || isSearchStalled}
        >
          Reset
        </button> */}
      </form>
      {/* <span hidden={!isSearchStalled}>Searching…</span> */}
    </div>
  );
}
