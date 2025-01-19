"use client";
import { Button } from "@/components/ui/button";
import QrCodeScanner from "../../../../components/components/qrcodeScanner";
import { useState, useEffect } from "react";
import SheetComponent from "../../../../components/components/sheet";
import {
  EllipsisIcon,
  ChevronLeft,
  QrCode,
} from "lucide-react";
import { comfortaa } from "@/app/page";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { EventSchemaType, scanResultType} from "@/lib/types";
import { functions } from "@/firebase.config";
import { httpsCallable } from "firebase/functions";
import ScanAnimation from "@/animations/scan";


const scanTicket = httpsCallable(functions, "scanTicket");

export default function ScanQRCode(params: { params: { data: string[] } }) {
  const eventID = params.params.data[0];
  const [eventData, setEventData] = useState<EventSchemaType>();
  const [errorState, setErrorState] = useState<any>();
  const [started, setStarted] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [idle, setIdle] = useState<boolean>(true);
  const [scannedID, setscannedID] = useState<string>("");
  const [processingState, setProcessing] = useState<boolean>(false);
  const [userState, setUserState] = useState<any>();
  const [queryingState, setQuerying] = useState<boolean>(false);
  const [ticketData, setTicketData] = useState<any>();
  const router = useRouter();
  const { toast } = useToast();


  function displayResult({scans, quantity}:scanResultType) {
    // console.log(scans, quantity);
    if (scans === null) {
      toast({ description: "invalid ticket", variant: "destructive" });
    }

    if ( scans && scans > 0) {
      toast({ description: "ticket verified" });
    }

    if (scans == 0) {
      toast({
        description: "ticket has no available scans",
        variant: "destructive",        
      });
    }
  }

  useEffect(() => {
    const eventData = sessionStorage.getItem(eventID);
    const userInfo = JSON.parse(Cookies.get("user") || "");

    setUserState(userInfo);

    if (!eventData) {
      //  router.push("/app/events")
      console.log("no event data");
    } else {
      setEventData(JSON.parse(eventData));
    }
  }, []);



  async function checkTicket({
    scannedID,
    eventID,
    setProcessing,
    setQuerying,
    setTicketData,
    setIdle,
    userID,
  }: {
    scannedID: string;
    eventID: string;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setQuerying: React.Dispatch<React.SetStateAction<boolean>>;
    setTicketData: React.Dispatch<React.SetStateAction<any>>;
    setIdle: React.Dispatch<React.SetStateAction<boolean>>;
    userID: string;
  }) {
    try {
      setProcessing(false);
      setQuerying(true);

      if (userID !== eventData?.creator?.uid) {
        console.log("user not creator");
        // Handle scanning ticket if the userID doesn't match creator ID
        const response = await scanTicket({
          eventId: eventID,
          ticketID: scannedID,
          userId: userID,
        }) as {data : scanResultType}

        console.log(response.data, "response from cloud function");
        
        if(response.data.scans !== null || undefined) displayResult({scans : response.data.scans, quantity : response.data.quantity});

      } else {
        // Handle fetching ticket scan data
        const response = await fetch("/api/data/read/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticketID: scannedID, eventID }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const res = await response.json();
        setTicketData(res.data);
        displayResult(res.data);
        setErrorState(String(res.data.scans));
        console.log("Ticket data:", res);
      }
    } catch (error) {
      console.error("Error in checkTicket:", error);
      window.alert("An unexpected error occurred");
    } finally {
      setQuerying(false);
      setIdle(true);
    }
  }

  // let count = 0;

  async function scannerInit() {
    // checkTicket({
    //   scannedID: "0544016639",
    //   eventID: eventID,
    //   setProcessing: setProcessing,
    //   setQuerying: setQuerying,
    //   setTicketData: setTicketData,
    //   setIdle: setIdle,
    //   userID: userState?.uid,
    // });

    // return;

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
          userID: userState?.uid,
          // creatorID: eventData?.creator.uid
        });
      })
      .catch((error) => {
        setScanning(false);
        // setErrorState(String(error) + count);
      });
  }

  return (
    <div
      className={` text-gray-700 w-screen h-screen flex flex-col items-center`}
    >
      <div className="flex justify-between h-[4rem] w-full p-4 z-10 bg-none">
        <button className="h-full aspect-square" onClick={() => router.back()}>
          <ChevronLeft color="red" />
        </button>
        {/* <div className="text-[2rem]">Scanner</div> */}
        <SheetComponent />
      </div>
      <div>
      <p className="font-bold text-[2rem] text-center text-wrap ">Click 'Scan' when you're ready to scan ticket.</p>
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
          // <QrCode height={"40%"} width={"40%"} strokeWidth="1px" />
          <ScanAnimation />
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
      {/* <div className=" h-[2px] w-[200px]">{errorState}</div>
      <div className=" h-[2px] w-[200px] mt-4">{scannedID}</div>x
      <div className=" h-[2px] w-[200px]">{ticketData && ticketData.scans}</div> */}
    </div>
  );
}
