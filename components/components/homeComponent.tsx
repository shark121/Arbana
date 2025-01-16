import HomeAnimation from "@/animations/homeAnimation";
import { ArrowRightIcon, QrCodeIcon } from "lucide-react";
import { ColoredSearch } from "@/images/svg/search";

export default function HomeComponents({
  setScannerState,
  setIsSearching,
}: {
  setScannerState: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full flex flex-col h-full items-center justify-center">
      <HomeAnimation />
      <div className="w-full flex flex-col items-center justify-center">
        <div className="text-[2rem] text-gray-800 text-center flex items-center justify-center font-bold">
          Discover Events, Book Your Spot, Enjoy the Moment!
        </div>
        <div className="text-[1rem] text-gray-600 text-center flex items-center justify-center">
          <button
            className="py-2 px-10 bg-black m-2 text-white rounded-full flex gap-2"
            onClick={() => {
              setScannerState(true);
              setIsSearching(false);
            }}
          >
            <QrCodeIcon color="white" strokeWidth="2px" size={20} />
            Scan QR
          </button>{" "}
          <button
            className="py-2 px-10  outline outline-gray-100 outine-[1px] m-2 text-black rounded-full flex  items-center justify-center gap-2"
            onClick={() => {
              setScannerState(false);
              setIsSearching(true);
            }}
          >
            Get Started
            <div className="flex items-center justify-center h-full rounded-full bg-gray-100 aspect-square">
              <ArrowRightIcon size={20} />
            </div>
            {/* <ColoredSearch size={"20px"} /> */}
          </button>
        </div>
      </div>
    </div>
  );
}
