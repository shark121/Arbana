"use client";
import { useRouter } from "next/navigation";
import { comfortaa } from "@/app/page";
import { EventSchemaType as EventType } from "@/lib/types";
import { Button } from "../../../../components/ui/button";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Download, ChevronLeft } from "lucide-react";
import { COLORSMAP } from "../../../../../data/colors";
import jsPDF from "jspdf";
import QRcode from "qrcode";
import Image from "next/image";
import {ChevronRight} from "lucide-react"
import {EventsPieChart} from "@/charts/eventSalesPie"
import dynamic from "next/dynamic";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default function EventOptions({
  params,
}: {
  params: { data: string };
}) {
  const eventID = params.data;
  const [eventState, setEventState] = useState<EventType>();
  const [isReady, setIsReady] = useState(false);
  const [qrCode, setQrCode] = useState<string>();
  const router = useRouter();

  // const  = dynamic(() => import('../components/header'), {
  //   loading: () => <p>Loading...</p>,
  // })

  const pdf = new jsPDF({ format: "c5" });

  function generatePDF() {
    const ticketState = eventState;
    qrCode && pdf.addImage(qrCode, "PNG", 10, 60, 50, 50);
    pdf.setFontSize(20);
    eventState && pdf.text(eventState.name, 10, 10);
    // pdf.setFontSize(7);

    // pdf.setFontSize(7);
    // pdf.text(`Name: ${eventState?.name}`, 10, 20);
    // pdf.text(`Date: ${eventState?.date}`, 10, 25);
    // pdf.text(`Tier: ${eventState?.tier}`, 10, 30);
    // pdf.text(`Price: ${ticketState?.price}`, 10, 35);
    // pdf.text(`Ticket ID: ${ticketState?.ticketID}`, 10, 50);
    pdf.save("ticket.pdf");
  }

  useEffect(() => {
    const event =
      sessionStorage.getItem(eventID) &&
      JSON.parse(sessionStorage.getItem(eventID)!);
    setEventState(event);
  }, []);

  useEffect(() => {
    if (eventState) {
      QRcode.toDataURL(`${domain}/event/getEvent/${eventID}`).then((url) => {
        setQrCode(url);
        setIsReady(true);
      });
    }
  }, [eventState]);

  const labelStyling = "text-[0.7rem] text-gray-500 mb-1";
  const borderStyling =
    "border-b-[1px] border-gray-100 mb-2 text-[0.8rem] text-gray-700";


    // return <EventsPieChart/>

  return (
    <div className={`${comfortaa.className} min-w-screen min-h-screen p-2`}>
      <div className="h-[3rem] w-full flex justify-between items-center mb-4">
        <button className="w-[40px]" onClick={() => router.back()}>
          <ChevronLeft size={20} color={"red"} />
        </button>
        {eventState && <div className="text-[1rem] text-wrap">{}</div>}
        <Button
          onClick={() => (window.location.href = `/eventInfo/${eventID}`)}
          className="w-[6.5rem] h-[2.5rem] flex items-center justify-center rounded-lg p-1 gap-1 bg-primary"
        >
          <div className="text-white">Update</div>
          <Edit size={20} color={"#ffffff"} />
        </Button>
      </div>
      {eventState && (
        <div>
          {/* <div className="relative w-full h-[8rem] flex items-center justify-center">
            <Image
              src={eventState.imageUrl}
              alt="event image"
              className="object-cover h-[7rem] w-[7rem] rounded-full"
              width={100}
              // fill
              height={100}
            />
          </div> */}
          <div className={borderStyling}>
            <div className={labelStyling}>Event</div>
            {eventState.name}
          </div>
          <div className={borderStyling}>
            <div className={labelStyling}>Schedule</div>
            <div className="m-1">{eventState.time}</div>
            <div className="flex justify-between">
              <div>{eventState.startDate}</div>
              <div>{eventState.endDate}</div>
            </div>
          </div>
          <div className={borderStyling}>
            <div className={labelStyling}>Location</div>
            <div>{eventState.location}</div>
          </div>
          <div className={borderStyling}>
            <div className={labelStyling}>Description</div>
            <div>{eventState.description}</div>
          </div>
          <div className={borderStyling}>
            <div className={labelStyling}>Categories</div>
            {eventState.availableSeats.map((el) => (
              <div>
                <div className="w-full flex items-center justify-center">
                  {el.tier!}
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="">
                    <div className="text-gray-500 text-[0.7rem]">{"Price"}</div>
                    <div>{el.price!}</div>
                  </div>
                  <div className="">
                    <div className="text-gray-500 text-[0.7rem]">
                      {"Quantity"}
                    </div>
                    <div>{el.quantity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={borderStyling}>
            <div className={labelStyling}>Tiers</div>
            <div className="flex">
              {eventState.categories.map((el) => (
                <div className="m-1">{el}</div>
              ))}
            </div>
          </div>
          <div
            className="w-full h-[2.5rem] hover:bg-gray-200  border-b-[1px] border-gray-100 text-gray-700 text-[0.85rem] flex items-center cursor-pointer justify-between"
            onClick={() => window.location.href = `/myEvents/eventOptions/${eventID}/team`}
          >
            <div>Team</div>
            <ChevronRight size={20} color={"red"} />
          </div>
          {qrCode && (
            <div className="w-full h-[10.1rem] flex items-center justify-center">
              <div className="relative h-[10rem] w-[10rem] flex items-center justify-center">
                <Image
                  src={qrCode}
                  fill
                  alt="qrcode"
                  className="h-[8rem] w-[8rem]"
                ></Image>
                <Download
                  size={20}
                  color={COLORSMAP.primaryBlue}
                  onClick={() => generatePDF()}
                  className="-right-5 absolute"
                />
              </div>
            </div>
          )}

          <Button
            onClick={() => (window.location.href = `/scan/${eventID}`)}
            className="w-full h-[2rem] flex items-center justify-center"
          >
            Start Scaning
          </Button>
        </div>
      )}
    </div>
  );
}
