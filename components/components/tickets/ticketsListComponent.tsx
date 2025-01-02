import { TicketSchemaType } from "@/lib/types";
import Image from "next/image";
import QRcodeSVG from "@/images/svg/qrcode";
import { COLORSMAP } from "../../../data/colors";
import AlertDialogComp from "../deleteAlertPopover";
import Verified from "@/images/svg/verified";
import DeleteIcon from "@/images/svg/delete";
// import { AlertDialog, AlertDialog } from "@radix-ui/react-alert-dialog";

export default function TicketsListComponent({
  ticketData,
  handleTicketOnclick,
  handleDelete,
  setTickets,
  tickets,
}: {
  ticketData: TicketSchemaType;
  handleTicketOnclick: (ticket: TicketSchemaType) => void;
  handleDelete: (ticket: TicketSchemaType) => void;
  setTickets: React.Dispatch<React.SetStateAction<TicketSchemaType[]>>;
  tickets: TicketSchemaType[];
}) {
  return (
    <div className="w-full min-h-[7.5rem] flex items-center justify-between px-2">
      <div
        onClick={() => handleTicketOnclick(ticketData)}
        className="w-[20rem] h-[5rem] shadow-sm flex items-center px-4 py-1 justify-between text-gray-600 rounded-lg gap-1"
      >
        <div className="w-[60%] h-full">
          <div className="text-[0.8rem] font-bold">{ticketData.name}</div>
          <div className="text-[0.7rem]">{String(ticketData.startDate)}</div>
          <div className="text-[0.75rem] flex h-[1rem] w-full items-center justify-start gap-2">
            <div>{ticketData.tier}</div>
            <div>
              <Verified height="20px" width="20px" bgfill="red" />
            </div>
          </div>
        </div>
        <div className="h-[90%] w-[0.5px] rounded-full bg-gray-500"></div>
        <div className="relative h-full w-[30%] flex items center justify-center flex-col">
          <QRcodeSVG fill="black" height="80%" width="80%" />
        </div>
      </div>
      <div
        // onClick={() => handleDelete(ticketData)}
        className="h-[60px] w-[60px] flex items-center justify-center"
      >
        <AlertDialogComp
          displayText={""}
          heading="Delete Ticket ?"
          description="Deleted tickets cannot be refetched. Proceed?"
          // TriggerComponent={<DeleteIcon height="40px" width={"40px"} />}
          callback={() => handleDelete(ticketData)}
        />
      </div>
    </div>
  );

  
}
