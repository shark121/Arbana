import { Poiret_One } from "next/font/google";
import Verified from "./verified";

export const poFont = Poiret_One({
  weight: ["400"],
  subsets: ["latin"],
  preload: true,
});

export default function Logo({
  width,
  height,
  text,
}: {
  width?: string;
  height?: string;
  text?: string;
}) {
  return (
    <div
      className={`${poFont.className} ${text ?? "text-[3rem] relative"} ${
        height ?? "100% flex flex-col items-center justify-center"
      } ${width ?? "100%"}`}
    >
      <div className=" absolute top-2 right-2">
        <Verified height="20px" width="20px" bgfill="#ed191d" />
      </div>
      arbana
    </div>
  );
}
