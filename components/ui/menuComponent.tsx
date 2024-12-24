"use client";
import Link from "next/link";
import { auth } from "../../src/firebase.config";
import { useEffect, useState } from "react";
import { getCookie } from "../../src/lib/utils";
import parseJson from "parse-json";
import { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export default function MenuComponent({
  url,
  text,
  icon,
  color,
  callback,
}: {
  url: string;
  text: string;
  icon: JSX.Element;
  color?: string;
  callback?: () => void;
}) {
  const isUser = text == "User";
  const [userState, setUserState] = useState<FirebaseUser | null>();

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    const user: FirebaseUser | null = userString
      ? JSON.parse(userString)
      : null;
    console.log(user);
    user && setUserState(user);
    // console.log(user)
  }, []);

  const userItemStyle = "h-[100px] ";
  const regularItemStyle =
    "h-[60px] w-full text-[]  #border-b-[1px] bg-gray-100 #border-primary/20";
  const userIconStyle = "h-[4rem] w-[70%] mb-5";
  const regularCurrentIconStyle = "h-[20px] w-[20px]";

  const location = window.location.href.split("/");
  const locationName = `/${location[location.length - 1]}`;
  const isCurrentIcon = url === locationName;
  console.log(locationName, url);

  return (
    <SheetClose
      asChild
      type="submit"
      onClick={callback}
      className={` p-4 ${
        isUser ? userItemStyle : isCurrentIcon ? regularItemStyle : ""
      }  flex items-center `}
    >
      <div className={`h-[60px] w-full flex items-center justify-start rounded-lg `}>
        <div className={`${isUser ? userIconStyle : regularCurrentIconStyle}`}>
          {userState && isUser && userState.photoURL ? (
            <div className="relative">
              <Image
                src={userState?.photoURL || ""}
                alt="user Image"
                height={80}
                width={80}
                className="rounded-full"
              />
            </div>
          ) : (
            icon
          )}
        </div>
        <div className="ml-6 h-[20px] ">
          {isUser ? userState?.displayName : text}

        </div>
      </div>
    </SheetClose>
  );
}
