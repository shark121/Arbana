"use client"
import { poFont } from "@/images/svg/logo";
import Verified from "@/images/svg/verified";

export default function Arbana() {
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
  return (
    <div
      className={`min-h-screen text-[5rem] #bg-[#1E1E1E] bg-black w-full flex flex-col items-center justify-center  text-white ${poFont.className}`}
    >
      <Verified height="40px" width="40px" bgfill="#ED191D" checkfill="#fff" />
      <h1>arbana</h1>
    </div>
  );
}
