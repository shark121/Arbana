"use client";
import { Button } from "@/components/ui/button";
import QrCodeScanner from "./qrcodeScanner";
import { useState, useEffect } from "react";
import SheetComponent from "./sheet";
import {
  ArrowLeftIcon,
  ScanBarcodeIcon,
  EllipsisIcon,
  QrCodeIcon,
  ChevronLeft,
} from "lucide-react";
// import ToastComponent from "../../../../components/components/toast";
import { comfortaa } from "@/app/page";
import ScannerSVG from "@/images/svg/scanner";
import { Html5Qrcode } from "html5-qrcode";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";
import { StringToBoolean } from "class-variance-authority/types";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
// import { AppRouterInstance } from "next/navigation";
;




export default function ScannerComponent({
    setScannerState
}:{
    setScannerState: React.Dispatch<React.SetStateAction<boolean>>
}) {
//   const eventID = params.params.data[0];
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

  let count = 0;

  function redirectToRelativeUrl(fullUrl: string) {
    console.log(fullUrl);

 if (!fullUrl) {
    console.error("url is empty");
    window.alert("url is empty");
     
    setScannerState(false);
    return
  }

  const regex = /^https?:\/\/(?:localhost:3000|arbana\.vercel\.app)/;

  if (regex.test(fullUrl)) {
    const relativePath = fullUrl.replace(regex, "");

    console.log("Redirecting to:", relativePath);

    window.location.href = relativePath;
  } else {
    console.error("URL does not match the expected hosts or protocol.");
    window.alert("URL does not match the expected hosts or protocol.");
    setScannerState(false);
  }
}

  async function scannerInit() {
    setScanning(true);
    setIdle(false);
    const qrCodeReader = new Html5Qrcode("qr-code-reader", true);

    await QrCodeScanner(qrCodeReader)
      .then((res) => {
        setscannedID(res as string);
        setErrorState("");
        setProcessing(true);
        
        if(!res){
            window.alert("There was an error scanning the QR code");
            setScannerState(false);
            return
        }

        redirectToRelativeUrl(res as string);

        setScanning(false);

        setProcessing(true);
      })
      .catch((error) => {
        // setErrorState(String(error) + count);
         window.alert("Error: " + error);
         console.log(error)
        setScanning(false);
      });
  }

  if (processingState) {
    return <Loading />;
  } 

  return (
    <div
      className={` ${comfortaa.className}  w-screen h-screen flex flex-col items-center`}
    >
      <div className="flex justify-between h-[4rem] w-full p-4 z-10 bg-none">
        <button className="h-full aspect-square" onClick={() => setScannerState(false)}>
          <ChevronLeft color="red" />
        </button>
        {/* <div className="text-[2rem]">Scanner</div> */}
        <div></div>
        <div></div>
        {/* <SheetComponent /> */}
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
          <QrCodeIcon height={"40%"} width={"40%"} strokeWidth="1px" />
        ) : null}
        {processingState ? <Loading  /> : null}
        {queryingState ? <Loading /> : null}
      </div>

      <div></div>
     {!processingState && <Button
        className={`h-[2.5rem] min-w-[7rem] rounded-[0.5rem] ${
          processingState ? "bg-red-400" : "bg-primary"
        } flex items-center justify-center`}
        onClick={scannerInit}
      >
        Scan
      </Button>}
      {/* <div className=" h-[2px] w-[200px]">{errorState}</div> */}
      {/* <div className=" h-[2px] w-[200px] mt-4">{scannedID}</div> */}
      {/* <div className=" h-[2px] w-[200px]">{ticketData && ticketData.scans}</div> */}
    </div>
  );
}
