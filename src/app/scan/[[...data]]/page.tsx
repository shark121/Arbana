"use client";
import { Button } from "@/components/ui/button";
import QrCodeScanner from "../../../../components/components/qrcodeScanner";
import { useState } from "react";

export default function ScanQRCode() {
  const [file, setFile] = useState<File | null>(null);
  const [cameraId, setCameraId] = useState<any | null>();

  const startScanner = () =>( setCameraId(QrCodeScanner()));

  return (
    <div>
      <Button
        onClick={(e) => {
          startScanner();
        }}
      >
        Start
      </Button>
      <div id="qr-code-reader"></div>
      <div className="bg-red-200 h-[200px] w-[200px]">{cameraId}</div>
    </div>
  );
}
