import { Loader } from "lucide-react";
import LoaderComponent from "../../components/components/loader";
import LoaderSvg from "@/images/svg/loaderSvg";

export default function Loading() {
  return (
    <div className="absolute top-0 z-10 bottom-0 left-0 right-0 flex items-center justify-center">
      <LoaderSvg />
    </div>
  );
}
