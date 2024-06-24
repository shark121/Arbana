"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/utils";
import { SearchCombobox } from "./headlessCombobox";
import EventComponent, { EventType } from "../ui/eventComponent";
import Categories from "./categories";
import LoaderComponent from "../ui/loader";
import Link from "next/link";
import UserSVG from "@/images/svg/user";
import { Comfortaa } from "next/font/google";
import SearchBar from "../ui/searchBar";
import MenuSVG from "@/images/svg/menu";
import { COLORSMAP } from "../../data/colors";

const comfortaa = Comfortaa({
  weight: ["400", "700", "300", "500"],
  subsets: ["cyrillic-ext", "greek"],
});

export default function ListComponent({ data }: { data: EventType[] }) {
  const [shoulDisplay, setShouldDisplay] = useState(false);
  const [value, setValue] = useState<EventType | null>(null);
  const [currentCategory, setCurrentCategory] = useState("All");

  console.log(data);

  useEffect(() => {
    if (!getCookie("user")) {
      window.location.href = "/home";
    } else {
      setShouldDisplay(true);
    }
  }, []);

  if (shoulDisplay) {
    if (!data)
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-blue-100">
          <LoaderComponent />
        </div>
      );

    let list = data.map((event, i) => <EventComponent event={event} key={i} />);
    const filteredData = data.filter((event) =>
      event.categories.includes(currentCategory)
    );

    if (currentCategory !== "All") {
      data = filteredData;
      list = filteredData.map((event, i) => (
        <EventComponent event={event} key={i} />
      ));
    }

    return (
      <div
        className={`h-screen w-screen flex flex-col py-4 items-center bg-background ${comfortaa.className}  `}
      >
        <div className="w-screen flex justify-between p-4 flex-col">
          <div className="h-[40px] w-full flex justify-between ">
            <Link href={""} className="relative w-[30px] h-[30px]">
              <UserSVG fill="#371fef" />
            </Link>
            <MenuSVG  width="30px" height="30px" fill={COLORSMAP.primaryBlue}/>
          </div>
          <div className="relative h-[4rem] flex items-center justify-center ">
            {<SearchBar data={data} value={value} setValue={setValue} />}
          </div>
        </div>
        <div>
          <Categories
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
          {list}
        </div>
      </div>
    );
  } else {
    return <div className="">{shoulDisplay && <LoaderComponent />}</div>;
  }
}
