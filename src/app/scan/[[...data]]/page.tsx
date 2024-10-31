"use client";
import { Button } from "@/components/ui/button";
import QrCodeScanner from "../../../../components/components/qrcodeScanner";
import { useState, useEffect } from "react";

export default function ScanQRCode(params: { params: { data: string[] } }) {
  const eventID = params.params.data[0];
  const [file, setFile] = useState<File | null>(null);
  const [errorState, setErrorState] = useState<any>();
  const [scannedID, setscannedID] = useState<string>("8160083558");
  let count = 0;

  useEffect(() => {
    console.log(errorState);
  }, [errorState]);

  useEffect(() => {
    fetch("/api/data/read/scan", {
      method: "POST",
      body: JSON.stringify({ ticketID: scannedID, eventID: eventID }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="">
      <Button
      className="h-[7rem] w-[7rem] rounded-full bg-primary animate-pulse"
        onClick={async (e) => {
          await QrCodeScanner()
            .then((res) => {
              setscannedID(res as string);
              setErrorState("");
              // window.location.href = `/ticket/${res}`;
            })
            .catch((error) => {
              count = count + 1;
              setErrorState(String(error) + count);
            });
        }}
      >
        Start
      </Button>
      <div id="qr-code-reader"></div>
      <div className=" h-[200px] w-[200px]">{errorState}</div>
      <div className=" h-[200px] w-[200px]">{scannedID}</div>
      {String(QrCodeScanner().then(res=><div>{String(res)}</div>))}
    </div>
  );
}
