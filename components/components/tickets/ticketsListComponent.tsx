import { TicketType } from "@/lib/types";
import Image from "next/image";
import QRcodeSVG from "@/images/svg/qrcode";
import {COLORSMAP} from "../../../data/colors";

export default function TicketsListComponent({
  ticketData,
  handleTicketOnclick,
}: {
  ticketData: TicketType;
  handleTicketOnclick: (ticket: TicketType) => void;
}) {
  return (
    <div className="w-[23rem] h-[10rem] bg-white shadow-sm rounded-[1.5rem] m-1 flex items-center flex-col justify-between p-0">
      <div className="flex justify-between m-2 w-full p-2">
        <div className="relative h-[5rem] w-[5rem] ">
          <Image
            src={ticketData.imageUrl}
            alt="ticket"
            fill
            className="rounded-2xl"
          />
        </div>
        <div className="w-[60%] h-[3.5rem]">
          <div className="text-[0.7rem] text-gray-600">
            {ticketData.startDate}
          </div>
          <div className="text-[1rem]">{ticketData.name}</div>
        </div>
        <div
          className="w-[3rem] h-[3rem] bg-gray-50 p-3 rounded-full"
          onClick={() => handleTicketOnclick(ticketData)}
        >
          <QRcodeSVG fill={COLORSMAP.primaryBlue}/>
        </div>
      </div>
      <div className="w-full outline-dashed outline-1 outline-gray-200"></div>
      <div className="h-[3rem] w-full bg-white relative rounded-b-[1.5rem] flex justify-between">
        <div className="w-[1.2rem] h-[1.2rem] rounded-full bg-gray-50 -m-2 "></div>

        <div className="w-[1.2rem] h-[1.2rem] rounded-full bg-gray-50 -m-2 "></div>
      </div>
    </div>
  );
}
