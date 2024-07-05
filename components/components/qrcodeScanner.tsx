import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

async function getCameras(): Promise<string | null> {
  return await Html5Qrcode.getCameras()
    .then((cameras) => cameras[0].id)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default async function QrCodeScanner() {
  const qrCodeReader = new Html5Qrcode("qr-code-reader", true);

  getCameras()
  .then((cameraId) => {
    return cameraId;
  }
  )
  .then((cameraId) => {
    console.log(cameraId);
    cameraId &&
      qrCodeReader.start(
        { facingMode: "environment"},
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          console.log(decodedText);
          qrCodeReader.stop();
        },
        (errorMessage) => {
          console.error(errorMessage);
        }
      );
  });
}
