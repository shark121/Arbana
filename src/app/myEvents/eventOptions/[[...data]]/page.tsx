"use client";

import { Button } from "../../../../components/ui/button";
import { useEffect, useState } from "react";

export default function EventOptions({ params }: { params: { data: string[] } }) {
    const eventID = params.data[0]


  return (
    <div>
      <div
        onClick={() => (window.location.href = `/eventInfo/${eventID}`)}
        className="w-full h-[2rem] flex items-center justify-center"
      >
        Edit Event
      </div>
      <div
        onClick={() => (window.location.href = `/scan/${eventID}`)}
        className="w-full h-[2rem] flex items-center justify-center"
      >
        Scan
      </div>
    </div>
  );
}
