"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RadioGroupComponent from "../../../../components/components/radioGroup";
import { Input } from "@/components/ui/input";
import DialogComponent from "../../../../components/components/dialog";
import Counter from "../../../../components/components/counter";
import QRcode from "qrcode";
import { generateRandomId } from "@/lib/utils";
import BackSVG from "@/images/svg/back";
import { comfortaa } from "../../page";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import {useRouter} from "next/navigation";

const Providers = [
  { label: "MTN", value: "MTN" },
  { label: "Vodafone", value: "Vodafone" },
  { label: "AirtelTigo", value: "AirtelTigo" },
  { label: "Glo", value: "Glo" },
];

export default function Booking({ params }: { params: {} }) {
  const router = useRouter();
  
  const [providerState, setProviderState] = useState<string>("MTN");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<number>(1);
  const [ticketState, setTicketState] = useState<{
    name: string;
    startDate: string;
    endDate: string;
    eventID: string;
    tier: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>();
  const [headerText, setHeaderText] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  
  const tax = 3.50;
  
  



  function TicketComponent({
    imageUrl,
    tier,
    price,
    startDate,
    endDate,
    name,
  }: {
    imageUrl: string;
    tier: string;
    price: number;
    startDate: string;
    endDate: string;
    name: string;
  }) {
    return (
      <div className=" relative flex flex-col items-start  justify-center w-[90%] h-[8rem] p-2 rounded-xl shadow-sm bg-white">
        <div className="w-full ">
          <div className="h-[6rem]  flex relative w-full gap-3 ">
            <div className="relative h-[6rem] w-[6rem] mx-1">
              <Image
                fill
                alt="ticket image"
                src={imageUrl}
                className="rounded"
              />
            </div>
            <div className="p-x w-[60%] flex  flex-col justify-start items-start">
              <div className="font-bold ">{name}</div>
              <div className="text-[0.8rem] text-gray-500 flex w-full ">
                {/* <div>{`${startDate}   -   ${endDate}`}</div> */}
                <div>{tier}</div>
              </div>
              {/* <div className="font-bold  absolute right-2 bottom-2">
                ${price}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OrderSummary({price, quantity}:{price:number, quantity : number}) {
    const total = (price * quantity) + tax;
    return (
      <div className="w-full h-[18rem]  flex items-center justify-start font-bold  flex-col">
        <div className="w-full h-[50px]  flex items-center justify-start p-6 font-bold  ">
          Order Summary
        </div>
        <div className="w-[92%] h-full  rounded-xl shadow-sm flex items-center flex-col">
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">price</div>
            <div className="">${price}</div>
          </div>
          <Separator  orientation="horizontal" className="w-[90%] "/>
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">quantity</div>
            <div className="">{quantity}</div>
          </div>
          <Separator  orientation="horizontal" className="w-[90%] "/>
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">tax</div>
            <div className="">${tax}</div>
          </div>
          <Separator  orientation="horizontal" className="w-[90%] "/>
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">total</div>
            <div className="">${total}</div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log(providerState);
    const ticket = sessionStorage.getItem("ticket");
    let parsedTicket = ticket && JSON.parse(ticket);
    setTicketState(parsedTicket);
  }, [providerState]);

  async function handleOnClick(
    quantity: number,
    phoneNumber: string,
    provider: string,
    price?: number
  ) {
    price = price ?? 0;

    await fetch(`http://localhost:3000/api/data/read/getTickets/${quantity}`)
      .then(async (response) => {
        let text = await response.json();
        console.log(text);
        if (text.response === false) {
          setText(
            "We cannot satisfy your order at this time, please try again later."
          );
          setHeaderText("Insufficient tickets");
          setIsOpen(true);
          return "error";
        }
      })
      .catch((error) => {
        // console.log(error);
        setText("There was an error completing your request.");
        setHeaderText("Error");
        setIsOpen(true);
        return "error";
      })
      .then(async () => {
        await fetch(
          `http://localhost:3000/api/payment/request/${phoneNumber}/${provider}/${price}`
        )
          .then(async (response) => {
            let text = await response.json();
            console.log(text);
            if (text.response === false) {
              setText("Payment failed, please try again later.");
              setHeaderText("Payment failed");
              setIsOpen(true);
              return "error";
            }

            const ticketWithID = { ...ticketState, ticketID: text.response };
            sessionStorage.setItem("ticket", JSON.stringify(ticketWithID));

            const verificationID = generateRandomId(10);
            sessionStorage.setItem("verificationID", verificationID);

            window.location.href = `/ticket/${text.response}/${verificationID}`;
          })
          .catch((error) => {
            console.log(error);
            setText(String(error));
            setHeaderText("Payment failed");
            return "error";
          });
      });

    const text = { response: generateRandomId(10) };

    const ticketWithID = { ...ticketState, ticketID: text.response, quantity };
    sessionStorage.setItem("ticket", JSON.stringify(ticketWithID));

    const verificationID = generateRandomId(10);
    sessionStorage.setItem("verificationID", verificationID);

    window.location.href = `/ticket/${text.response}/${verificationID}`;
  }

  return (
    <div
      className={`w-screen bg-blue-50/15  relative overflow-y-hidden flex items-center   flex-col gap-2 ${comfortaa.className}`}
    >
      <div className="h-[65px] w-full  flex items-center justify-center font-bold text-[1.2rem]">
        <div className="absolute left-2" onClick={()=>router.back()}>
          <BackSVG height="23px" width="23px"  />
        </div>
        <div>Detail Order</div>
      </div>
      {ticketState && (
        <TicketComponent
          endDate={ticketState?.endDate}
          imageUrl={ticketState?.imageUrl}
          name={ticketState?.name}
          price={ticketState?.price}
          startDate={ticketState?.startDate}
          tier={ticketState?.tier}
        />
      )}
     { ticketState && <OrderSummary price={ticketState.price} quantity={ticketState.quantity} />}

      <div className="relative -z-10">
        <DialogComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          headerText={headerText}
          text={text}
        />
      </div>
      {/* <Input
        placeholder="Enter phone number"
        className="w-[15rem]"
        type="number"
        max={10}
        onChange={(e) => setPhoneNumber(e.target.value)}
      /> */}
      <RadioGroupComponent
        data={Providers}
        valueState={providerState}
        setValueState={setProviderState}
      />
      <Button
        onClick={async () =>
          await handleOnClick(
            ticketState?.quantity || 0,
            phoneNumber,
            providerState,
            ticketState?.price
          )
        }
      >
        Pay {ticketState && ticketState?.price * defaultValue}
      </Button>
    </div>
  );
}
