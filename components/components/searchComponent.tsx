"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { generateRandomId } from "@/lib/utils";
import SearchSVG from "@/images/svg/search";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventType } from "../ui/eventComponent";



export default function SearchComponent({
  data,
  value,
  setValue,
}: {
  value: EventType | null;
  setValue: React.Dispatch<React.SetStateAction<EventType | null>>;
  data: EventType[];
}) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen} >
      {!open && (
        <PopoverTrigger asChild>
          <div className="text-white"><SearchSVG fill="#000000" height="25px" width="25px"/></div>
        </PopoverTrigger>
      )}
      <PopoverContent className="w-screen h-screen p-0">
        <Command>
          <div className=" w-[4rem]">
            <CommandInput placeholder="Search event..."  />
          </div>
          <CommandEmpty>No event found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {data.map((event) => (
                <CommandItem
                  key={event.name}
                  value={event.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue.name === value?.name ? event : null);
                    console.log(value);
                    setOpen(false);
                    const eventInfo = JSON.stringify(event);
                    const eventID = generateRandomId(10);
                    sessionStorage.setItem(`${event.eventId}`, eventInfo);
                    window.location.href = `/event/getEvent/${event.eventId}`;
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.name === event.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {event.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
