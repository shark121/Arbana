"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";

export function SearchCombobox({
  data,
  selected,
  setSelected,
  filterParameter,
}) {
  const [query, setQuery] = useState("");
  const [opacity, setItemOpacity] = useState(1);

  const filteredData =
    query === ""
      ? data
      : data.filter((item) => {
          return item[filterParameter]
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  function handleNavigation(event) {
    setItemOpacity(0);
    console.log("navigation", event);
    const eventInfo = JSON.stringify(event);
    sessionStorage.setItem(`${event.eventId}`, eventInfo);
    window.location.href = `/event/getEvent/${event.eventId}`;
  }

  return (
    <div className="mx-auto w-52 text-[16px] ">
      <Combobox value={selected} onChange={(value) => setSelected(value)}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-inherit py-1.5 pr-8 pl-3 text-sm/6 text-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
            )}
            placeholder="Search..."
            displayValue={(item) => item?.name}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && selected && handleNavigation(selected);
            }}
          />
        </div>

        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <div className="">
            <ComboboxOptions
              anchor="bottom"
              className={`${
                opacity === 0 ? "hidden" : ""
              } w-[var(--input-length)] rounded-xl border border-black/5 bg-white p-1 [--anchor-gap:var(--spacing-6)] empty:hidden`}
            >
              {filteredData.map((item) => (
                <ComboboxOption
                  key={item.id}
                  value={item}
                  className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary/10"
                >
                  <div
                    className="text-sm/6 text-black h-full w-full"
                    onClick={() => handleNavigation(item)}
                    // onKeyDown={(e) => {e.key === "Enter"
                    // console.log(e.key)}}
                  >
                    {item[filterParameter]}
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </div>
        </Transition>
      </Combobox>
    </div>
  );
}
