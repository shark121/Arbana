import EmptyFolerSVG from "@/images/svg/emptyFolder";
import Image from "next/image";

export default function EmptyComponent({header, subHeader}: {header: string, subHeader: string}) {
  return (
      <div className="absolute top-0 left-0 right-0 bottom-0 text-gray-400  flex flex-col w-full h-full items-center justify-center ">
        <EmptyFolerSVG size={"100px"} />
        <div className="text-sm ">{header}</div>
        <div className="text-xs">{subHeader}</div>
      </div>
  );
}
