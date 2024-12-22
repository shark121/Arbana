import { TicketSchemaType } from "@/lib/types";
import Image from "next/image";
import QRcodeSVG from "@/images/svg/qrcode";
import { COLORSMAP } from "../../../data/colors";
import AlertDialogComp  from "../popover";
// import { AlertDialog, AlertDialog } from "@radix-ui/react-alert-dialog";





export default function TicketsListComponent({
  ticketData,
  handleTicketOnclick,
  handleDelete,
  setTickets,
  tickets
}: {
  ticketData: TicketSchemaType;
  handleTicketOnclick: (ticket: TicketSchemaType) => void;
  handleDelete :(ticket: TicketSchemaType) => void;
  setTickets: React.Dispatch<React.SetStateAction<TicketSchemaType[]>>;
  tickets: TicketSchemaType[];
}) {

 

  return (
    <div className="w-[20rem] h-[8rem] bg-white shadow-sm rounded-[1.5rem] m-1 flex items-center flex-col justify-between p-0">
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
            {String(ticketData.startDate)}
          </div>
          <div className="text-[1rem]">{ticketData.name}</div>
        </div>
        <div
          className="w-[3rem] h-[3rem] bg-gray-50 p-3 rounded-full"
          onClick={() => handleTicketOnclick(ticketData)}
        >
          <QRcodeSVG fill={COLORSMAP.primaryBlue} />
        </div>
      </div>
      <div className="w-full outline-dashed outline-1 outline-gray-200"></div>
      <div className="h-[3rem] w-full bg-white relative rounded-b-[1.5rem] flex justify-between">
        <div className="w-[1.2rem] h-[1.2rem] rounded-full bg-gray-50 -m-2 "></div>
        <div className="w-[1.2rem] h-[1.2rem] rounded-full bg-gray-50 -m-2 "></div>
        <div className="w-full h-full pr-4 pl-4 pt-1 flex justify-between items-end flex-col gap-6">
          {/* <div className="h-[2rem] w-[5rem] bg-red-500 text-white font-bold  rounded-[0.5rem] flex items-center justify-center">Delete</div> */}
          {/* <div className="h-[2rem] w-[5rem] bg-red-300 rounded-[0.5rem]"></div> */}
          <AlertDialogComp displayText={"Delete"} heading="Delete Ticket ?" description="Deleted tickets cannot be refetched. Proceed?"   callback={()=>handleDelete(ticketData)}/>
        </div>
      </div>
    </div>
  );
}
