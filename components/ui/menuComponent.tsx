"use client";
import Link from "next/link";
import { auth } from "../../src/firebase.config";
import { useEffect, useState } from "react";
import { getCookie } from "../../src/lib/utils";
import parseJson from "parse-json";
import { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";

export default function MenuComponent({
  url,
  text,
  icon,
  color,
}: {
  url: string;
  text: string;
  icon: JSX.Element;
  color?: string;
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
  const regularItemStyle = "h-[60px] w-full bg-primary/10 mb-5 rounded-[5rem]";
  const userIconStyle = "h-[80px] w-[80px] mb-5";
  const regularIconStyle = "h-[40px] w-[40px]";

  const location  = window.location.href.split("/")
  const locationName = `/${location[location.length - 1]}`
  console.log(locationName, url)

  return (
    <div
      className={` p-4 ${
        isUser ? userItemStyle : (locationName === url ? regularItemStyle : "")
      }  flex items-center font-bold `}
    >
      <div className={`${isUser ? userIconStyle : (regularIconStyle)}`}>
        {userState && isUser ? (
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
      <Link className=" shadow-sm ml-7 h-[20px] " href={url}>
        {isUser ? userState?.displayName : text}
      </Link>
    </div>
  );
}
