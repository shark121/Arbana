"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Head from "next/head";
import QRcode from "qrcode";
import { use, useEffect, useState } from "react";
import DialogComponent from "../../../../components/components/dialog";
import { Link } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import DownloadSVG from "@/images/svg/download";
import { comfortaa } from "../../page";
import {EventSchemaType as EventType} from "@/lib/types";
import SheetComponent from "../../../../components/components/sheet";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import { useRouter } from "next/router";
import Verified from "@/images/svg/verified";
import Loading from "@/app/loading";
import { useSearchParams } from "next/navigation";


export default function Ticket({ params }: { params: { data: string[] } }) {
  const [qrCode, setQrCode] = useState<string>();
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>("");
  const [dialogHeader, setDialogHeader] = useState<string>("");
  const [isLoading, setIsLoading ] = useState<boolean>(true)
  const [loadingBuffer, setLoadingBuffer] = useState<boolean>(true)
  const [eventState, setEventState] = useState<EventType>(); //
  const searchParams = useSearchParams();

  const [ticketState, setTicketState] = useState<{
    name: string;
    date: string;
    eventID: string;
    tier: string;
    price: number;
    ticketID: string;
    quantity: number;
  }>();

  const pdf = new jsPDF({ format: "c5" });
  console.log(params.data);
  function generatePDF() {
    qrCode && pdf.addImage(qrCode, "PNG", 10, 60, 50, 50);
    pdf.setFontSize(20);
    pdf.text("Reciept", 10, 10);
    pdf.setFontSize(7);
    pdf.text(`Name: ${ticketState?.name}`, 10, 20);
    pdf.text(`Date: ${ticketState?.date}`, 10, 25);
    pdf.text(`Tier: ${ticketState?.tier}`, 10, 30);
    pdf.text(`Price: ${ticketState?.price}`, 10, 35);
    pdf.text(`Ticket ID: ${ticketState?.ticketID}`, 10, 50);
    pdf.save("ticket.pdf");
  }


  useEffect(() => {
    let parsedTicket = JSON.parse(sessionStorage.getItem("ticket") || ""); 

    const allTickets = JSON.parse(sessionStorage.getItem("tickets") || "[]");  
    
    const arrayAlreadyContainsTicket = allTickets.some(
      (el: { ticketID: string }) => el.ticketID == parsedTicket?.ticketID
    );

    if(!arrayAlreadyContainsTicket && parsedTicket) {
      allTickets.push(parsedTicket);
      sessionStorage.setItem("tickets", JSON.stringify(allTickets));
    }
    
    setTicketState(parsedTicket);
    console.log(parsedTicket);
  }, []);

  useEffect(() => {
    let getQrCode = async () =>
      ticketState &&
      (await QRcode.toDataURL(ticketState?.ticketID, {
        errorCorrectionLevel: "H",
        type: "image/png",
      }));

    getQrCode().then((url) => {
      setQrCode(url);
    });
    setIsLoading(false)

  }, [ticketState]);

  useEffect(() => {
    const eventID = ticketState?.eventID;
    console.log(eventID);
    const eventState = eventID ? sessionStorage.getItem(eventID) : null;
    const eventJson = eventState && JSON.parse(eventState);
    setEventState(eventJson);
    console.log(eventJson);
     // generatePDF()
  }, [ticketState]);


  setTimeout(() => {
    setLoadingBuffer(false);
  }
  , 500);

  if(isLoading || loadingBuffer) return <Loading/>

  return (
    <div
      className={`bg-gray-50 #bg-opacity-15  min-h-screen min-w-screen ${comfortaa.className}`}
    >
      <div className="w-full h-[70px]  font-bold text-[1.4rem] flex items-center justify-between p-2">
        <div></div>
        {/* <div>QR code</div> */}
        <div></div>
        <SheetComponent />
      </div>
      <div className="flex items-center justify-center p-4 w-full h-[35rem] ">
        <div className="w-full h-full fixed -z-10">
          <DialogComponent
            isOpen={dialogIsOpen}
            setIsOpen={setDialogIsOpen}
            text={dialogText}
            headerText={dialogHeader}
          />
        </div>
        <div className="h-[450px] w-[350px] flex-col rounded-lg bg-white shadow-sm flex items-center justify-start p-4">
          <div className="h-[120px]  w-full  rounded-t-[2rem] flex items-center px-[0.2rem] rounded-lg">
            {/* <div className="w-[70px] h-[70px] relative flex justify-between py-1">
              {eventState && (
                <Image
                  src={eventState?.imageUrl}
                  alt="qrcode"
                  fill
                  className="rounded-lg"
                />
              )}
            </div> */}
            <div className="w-[70%] h-full py-6 flex flex-col justify-between px-2">
              <div className="font-bold text-gray-700">{ticketState?.name}</div>
              {/* <div className="font-bold">Some Event Name</div> */}

              {/* <div className="font-thin text-gray-300">{ticketState?.quantity}</div> */}
              <div className="font-thin text-gray-300">
                {ticketState?.ticketID}
              </div>
              <div className="font-thin text-gray-300">
                {ticketState?.tier ?? "VIP"}
              </div>
            </div>
          </div>
          {qrCode && (
            <Image
              src={qrCode}
              alt="QR code"
              height={250}
              width={250}
              className="rounded-xl"
            />
          )}
          <div className="w-full h-[50px]  flex items-center justify-center">
            <Verified height="40px" width="40px" bgfill="red" />
          </div>
        </div>
      </div>
      <div className=" w-full px-4 h-[80px] flex items-center justify-center">
        <button
          onClick={() => generatePDF()}
          className="bg-black p-4 h-[50px] flex  rounded-lg gap-4"
        >
          <div className="font-bold text-white ">Download</div>
          <DownloadSVG height="20px" width="20px" fill="white" />
        </button>
      </div>
    </div>
  );
}
