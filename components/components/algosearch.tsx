import React, { useState, useRef } from "react";
import {
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";
import Verified from "@/images/svg/verified";
import SheetComponent from "../../components/components/sheet";
import { motion as m, useScroll, useMotionValue } from "framer-motion";

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

  const { scrollY } = useScroll();
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const lastScrollY = useMotionValue(0);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const direction = latest < lastScrollY.get();
      setIsScrollingUp(direction);
      lastScrollY.set(latest);
    });
  }, []);

  const isSearchStalled = status === "stalled";

  useEffect(() => {
    setStatusChanged(!statusState);
  }, [status]);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }



   return (
    <div className="relative w-[250px] sm:w-[500px] h-[50px] sm:h-[60px] py-1 px-3 rounded-full bg-gray-100 flex items-center justify-center  ">
        <form
          action=""
          role="search"
          noValidate
          className="flex items-center justify-center w-[90%] h-full"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (inputRef.current) {
              inputRef.current.blur();
            }
            document.body.style.zoom = "100%";

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
            className="bg-inherit outline-none h-full w-full  text-gray-600"
            ref={inputRef}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder=""
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            autoFocus
          />
          <button type="submit" className="absolute right-3">
            <Verified height="30px" width="30px" bgfill="#ED191D" />
          </button>
        </form>
      </div>
   )
  
  return (
    <div
      className="flex items-center z-10 h-[4rem] justify-between sticky top-2 w-full"
    >
      <div></div>
      <div className="relative w-[250px] sm:w-[500px] h-[50px] sm:h-[60px] py-1 px-3 rounded-full bg-gray-100 flex items-center justify-center  ">
        <form
          action=""
          role="search"
          noValidate
          className="flex items-center justify-center w-[90%] h-full"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (inputRef.current) {
              inputRef.current.blur();
            }
            document.body.style.zoom = "100%";

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
            className="bg-inherit outline-none h-full w-full  text-gray-600"
            ref={inputRef}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder=""
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            autoFocus
          />
          <button type="submit" className="absolute right-3">
            <Verified height="30px" width="30px" bgfill="#ED191D" />
          </button>
        </form>
      </div>
      <SheetComponent />
    </div>
  );
}

{
  /* <span hidden={!isSearchStalled}>Searching…</span> */
}
{
  /* <button
type="reset"
hidden={inputValue.length === 0 || isSearchStalled}
>
Reset
</button> */
}
