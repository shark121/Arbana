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

function getDims(h:number,w:number){
  return{height: h , widht:w}
}

export default async function QrCodeScanner(qrCodeReader: Html5Qrcode) {

  try {
    const cameraId = await getCameras();
    if (cameraId) {
      return new Promise((resolve, reject) => {
        qrCodeReader.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {height:250, width:250},
            // aspectRatio: 1.333334
            aspectRatio: 1

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
