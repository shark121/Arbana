import { Html5Qrcode } from "html5-qrcode";
async function getCameras() {
  try {
    const cameras = await Html5Qrcode.getCameras();
    return cameras[0].id;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function QrCodeScanner() {
  const qrCodeReader = new Html5Qrcode("qr-code-reader", true);

  try {
    const cameraId = await getCameras();
    if (cameraId) {
      return new Promise((resolve, reject) => {
        qrCodeReader.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            resolve(decodedText);
            qrCodeReader.stop();
          },
          (errorMessage) => {
            // qrCodeReader.start();
            console.error(errorMessage);
            // reject(errorMessage);
          }
        );
      });
    } else {
      throw new Error("No camera found.");
    }
  } catch (error) {
    console.error(error);
  }
}
