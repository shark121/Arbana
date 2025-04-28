"use client"
import { useEffect, useState } from "react";

import TicketPopover from "../scan/ticketPopOver";

export default function PopPage() {
  const data = {
    createdAt: "2025-04-24T11:31:38.856Z",
    endDate: "2025-05-01T05:00:00.000Z",
    eventID: "99417",
    groupNumber: 1,
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/arbana-02.appspot.com/o/img_59adc4aa.png?alt=media&token=a3e9a484-cd7b-46cd-b3d4-e8a2c82d99db",
    name: "JEsus event",
    price: 1,
    quantity: 1,
    scans: 1,
    startDate: "2025-04-02T05:00:00.000Z",
    ticketID: "4705278281",
    tier: "VIP",
    transactionID: "sx6t1iv3al",
    uid: "h4tLf5B8YFdGB05pbIesB0EuDxj2",
  };
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className="h-screen w-screen ">
      <div className="text-2xl">Pop Page</div>
      {open && <TicketPopover data={data} open={open} setOpen={setOpen} />}
    </div>
  );
}
