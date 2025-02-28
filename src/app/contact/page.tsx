"use client";
import { Input } from "@/components/ui/input";
import ContactIcon from "@/images/svg/contact";
// import Phone from "@/images/svg/phone";
import { ChevronLeft} from "lucide-react";
import Mail from "@/images/svg/mail";
import Phone from "@/images/svg/phone";

export default function Contact() {
  return (
    <div className="flex items-center justify-between h-screen flex-col p-6 font-light">
      <div className="font-bold text-[2rem] text-gray-700 flex items-center justify-between w-full">
        <ChevronLeft className="inline-block" size={30} color="red"
        onClick={() => window.history.back() }
        />
        Contact Us
        <div></div>
        </div>
      <div>
        We're passionate about our app and want to make sure you have the best
        experience. Get in touch with any questions or feedback!
      </div>
      <Mail />
      <div className="flex flex-col gap-4 text-gray-800 font-light">
        <div className="flex gap-4 items-center justify-center">
          <a href="tel:+1 (318) 750-9160">
            <Phone size={50}/>
          </a>
          <Input value="+1 (318) 750-9160"  className="w-[18rem]"/>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <a href="mailto:support@arbana.io">
            <Mail size="50" />
          </a>
          <Input value="team@arbana.io" className="w-[18rem]"/>
        </div>
      </div>
      <div></div>
    </div>
  );
}
