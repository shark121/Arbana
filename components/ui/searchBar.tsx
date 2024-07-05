"use client";

import FileterSVG from "@/images/svg/filter";
import SearchIcon from "../../src/images/svg/search";
import { SearchCombobox } from "../components/headlessCombobox";
import { EventType } from "../ui/eventComponent";
import { useState } from "react";
import { DrawerComponent } from "../components/drawer";
import { parametersList } from "../../data/parameters";

export function FilterButton() {
  return (
    <div className="">
      <FileterSVG
        height="20px"
        width="20px"
        fill="#371fef"
        backgroundColor="#371fef"
      />
    </div>
  );
}


function Parameter({ parameter,setFilterParameter, filterParameter }: { parameter: string, filterParameter:string, setFilterParameter: React.Dispatch<React.SetStateAction<string>>}) {
  return <button className={`  m-2 rounded-[1rem] px-4 h-[2rem] ${parameter === filterParameter ? "bg-primary text-white": " ring-primary ring-gray-200 text-primary"} `}
  onClick={(e)=>setFilterParameter(parameter)}
  >{parameter}</button>;
}

export default function Search({
  data,
  value,
  setValue,
}: {
  data: EventType[];
  value: EventType | null;
  setValue: React.Dispatch<React.SetStateAction<EventType | null>>;
}) {
  const [filterParameter, setFilterParameter] = useState("name");
  const [openSearchSpace, setOpenSearchSpace] = useState(false);

  const parameterComponents = parametersList.map((parameter, i) => (
    <Parameter key={i} parameter={parameter} filterParameter={filterParameter} setFilterParameter={setFilterParameter} />
  ));

  return (
    <div className=" flex h-[3rem] w-[18rem] items-center justify-center rounded-[1rem] px-2  py-2 bg-gray-100 ring-primary z-10"
    onClick={()=>setOpenSearchSpace(true)}
    >
      {/* <div className={`h-screen w-screen ${openSearchSpace ? "bg-white z-10 absolute top-0 bottom-0 left-0 right-0" : "bg-none" }`}></div> */}
      <button className="h-[80%] w-[10%] ">
        <SearchIcon fill="gray" height="20px" width="20px" />
      </button>
      <div className="flex h-full w-[80%] items-center justify-center relative ">
        <SearchCombobox
          data={data}
          selected={value}
          setSelected={setValue}
          filterParameter={filterParameter}
        />
      </div>
      <DrawerComponent contentData={parameterComponents} />
    </div>
  );
}
