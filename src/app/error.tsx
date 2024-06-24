"use client"
import ErrorSVG from "@/images/svg/error";
import {Comfortaa} from "next/font/google";

const comfortaa = Comfortaa({
  weight: ["400", "700", "300", "500"],
  subsets: ["cyrillic-ext", "greek"],
});

export default function Error() {
  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center ${comfortaa.className}`}>
      <ErrorSVG height="180px" width="180px" fill="gray"/>
      <div className="text-[30px] m-4 text-gray-500">There was an error</div>
    </div>
  );
}
