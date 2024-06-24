"use client";
import Image from "next/image";

export default function TicketComponent({ qrCode }: { qrCode: string }) {
  return (
    <div>
      <div className="flex items-center justify-center p-4 w-full h-[40rem] ">
        {qrCode && (
          <Image src={qrCode} alt="QR code" height={300} width={300} />
        )}
      </div>
    </div>
  );
}
