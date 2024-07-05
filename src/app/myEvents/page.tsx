"use client"
import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation"


export default function MyEvents() {
  const router = useRouter();


  return <div className="w-full">
    <Button onClick={()=>router.push("/myEvents/create")}>Create Event</Button>
  </div>;
}
