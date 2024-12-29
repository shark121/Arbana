"use client";
import { Button } from "@/components/ui/button";
import QrCodeScanner from "../../../../components/components/qrcodeScanner";
import { useState, useEffect } from "react";
import SheetComponent from "../../../../components/components/sheet";
import { ArrowLeftIcon, ScanBarcodeIcon, EllipsisIcon, ChevronLeft } from "lucide-react";
import ToastComponent from "../../../../components/components/toast";
import { comfortaa } from "@/app/page";
import ScannerSVG from "@/images/svg/scanner";
import { Html5Qrcode } from "html5-qrcode";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";
import { StringToBoolean } from "class-variance-authority/types";
import { useRouter } from "next/navigation";

function displayResult({ scans }: { scans: number | null }) {

  if (scans === null) {
    window.alert("invalid ticket");
  }

  if (scans == 1) {
    window.alert("ticket verified");
  }

  if (scans == 0) {
    window.alert("ticket has no available scans");
  }

}

export default function ScanQRCode(params: { params: { data: string[] } }) {
  const eventID = params.params.data[0];
  const [file, setFile] = useState<File | null>(null);
  const [errorState, setErrorState] = useState<any>();
  const [started, setStarted] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [idle, setIdle] = useState<boolean>(true);
  const [scannedID, setscannedID] = useState<string>("");
  const [processingState, setProcessing] = useState<boolean>(false);
  const [queryingState, setQuerying] = useState<boolean>(false);
  const [ticketData, setTicketData] = useState<any>();
  const router = useRouter();
  const { toast } = useToast();

  async function checkTicket({
    scannedID,
    eventID,
    setProcessing,
    setQuerying,
    setTicketData,
    setIdle,
  }: {
    scannedID: string;
    eventID: string;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setQuerying: React.Dispatch<React.SetStateAction<boolean>>;
    setTicketData: React.Dispatch<React.SetStateAction<any>>;
    setIdle: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    setProcessing(false);

    toast({ description: "Hello toast" });

    setQuerying(true);

    return fetch("/api/data/read/scan", {
      method: "POST",
      body: JSON.stringify({ ticketID: scannedID, eventID: eventID }),
    })
      .then((res) => {
        setQuerying(false);
        setIdle(true);
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setTicketData(data);
        setQuerying(false);
        // window.alert(data)
        displayResult(data);
        setErrorState(String(data.scans));
        console.log(data, "this is the data");
      })
      .catch((error) => {
        console.log(error);
        window.alert(error);
      });
  }

  let count = 0;

  async function scannerInit() {

  //   checkTicket({
  //     scannedID: "5267575548",
  //     eventID: eventID,
  //     setProcessing: setProcessing,
  //     setQuerying: setQuerying,
  //     setTicketData: setTicketData,
  //     setIdle: setIdle,
  //   });

    
  // return 
  
    setScanning(true);
    setIdle(false);
    const qrCodeReader = new Html5Qrcode("qr-code-reader", true);

    await QrCodeScanner(qrCodeReader)
      .then((res) => {
        setscannedID(res as string);
        setErrorState("");

        setScanning(false);

        setProcessing(true);

        checkTicket({
          scannedID: res as string,
          eventID: eventID,
          setProcessing: setProcessing,
          setQuerying: setQuerying,
          setTicketData: setTicketData,
          setIdle: setIdle,
        });
      })
      .catch((error) => {
        setErrorState(String(error) + count);
      });
  }

  return (
    <div
      className={` ${comfortaa.className}  w-screen h-screen flex flex-col items-center`}
    >
      <div className="flex justify-between h-[4rem] w-full p-4 z-10 bg-none">
        <button className="h-full aspect-square"
        onClick={()=>router.back()}
        >
          <ChevronLeft color="red" />
        </button>
        <div className="text-[2rem]">Scanner</div>
        <SheetComponent />
      </div>
      <div
        id="qr-code-reader"
        className={` ${
          scanning ? "h-[535px] w-[400px]" : ""
        } my-4 flex items-center justify-center`}
      ></div>
      <div
        className={`my-4 ${
          scanning ? "hidden" : "flex"
        } items-center justify-center h-[400px] w-[400px]`}
      >
        {idle ? (
          <ScanBarcodeIcon height={"40%"} width={"40%"} strokeWidth="1px" />
        ) : null}
        {processingState ? <EllipsisIcon height={"40%"} width={"40%"} /> : null}
        {queryingState ? <EllipsisIcon height={"40%"} width={"40%"} /> : null}
      </div>

      <div></div>
      <Button
        className={`h-[2.5rem] min-w-[7rem] rounded-[0.5rem] ${
          processingState ? "bg-red-400" : "bg-primary"
        } flex items-center justify-center`}
        onClick={scannerInit}
      >
        Scan
      </Button>
      {/* <div className=" h-[2px] w-[200px]">{errorState}</div> */}
      {/* <div className=" h-[2px] w-[200px] mt-4">{scannedID}</div> */}
      {/* <div className=" h-[2px] w-[200px]">{ticketData && ticketData.scans}</div> */}
    </div>
  );
}
