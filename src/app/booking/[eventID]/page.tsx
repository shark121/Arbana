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
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { TicketSchemaType } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import { COLORSMAP } from "../../../../data/colors";
import SheetComponent from "../../../../components/components/sheet";
import Loading from "@/app/loading";
import { auth, functions } from "@/firebase.config";
import Cookies from "js-cookie";
import { httpsCallable } from "firebase/functions";

const startPaymentProcess = httpsCallable(functions, "startPaymentProcess", {
  limitedUseAppCheckTokens: true,
});

const Providers = [
  { label: "MTN", value: "MTN" },
  { label: "Vodafone", value: "Vodafone" },
  { label: "AirtelTigo", value: "AirtelTigo" },
  { label: "Glo", value: "Glo" },
];

export default function Booking({ params }: { params: {} }) {
  const router = useRouter();

  const [providerState, setProviderState] = useState<string>("MTN");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<number>(1);
  const [loadingBuffer, setLoadingBuffer] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [ticketState, setTicketState] = useState<Omit<
    TicketSchemaType,
    "transactionID"
  > | null>(null);
  const [headerText, setHeaderText] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const tax = 3.5;

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
                <div>{tier}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OrderSummary({
    price,
    quantity,
  }: {
    price: number;
    quantity: number;
  }) {
    const total = price * quantity + tax;

    setTotal(total);

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
          <Separator orientation="horizontal" className="w-[90%] " />
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">quantity</div>
            <div className="">{quantity}</div>
          </div>
          <Separator orientation="horizontal" className="w-[90%] " />
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">tax</div>
            <div className="">${tax}</div>
          </div>
          <Separator orientation="horizontal" className="w-[90%] " />
          <div className="h-[60px] w-full flex justify-between items-center p-4">
            <div className="w-full">total</div>
            <div className="">${total}</div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log(auth.currentUser, "user");
    console.log(providerState);
    const ticket = sessionStorage.getItem("ticket") as string;

    let parsedTicket = JSON.parse(ticket) as Omit<
      TicketSchemaType,
      "transactionID"
    >;
    setTicketState(parsedTicket);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [ticketState]);

  async function handleOnClick(
    quantity: number,
    phoneNumber: string,
    provider: string,
    price?: number
  ) {
    setIsLoading(true);
    price = price ?? 0;
    phoneNumber = phoneNumber ?? 200000;

    const userCookies = Cookies.get("user");

    if (!userCookies) return;

    const idToken = JSON.parse(userCookies).token.token;
    console.log(idToken, "idToken");

    if (!idToken) return;

    // return

    // const ticketFormData = new FormData();
    // ticketFormData.append("ticket", JSON.stringify(ticketState));

    // await fetch(
    //   `/api/payment/request/${phoneNumber}/${provider}/${total}`,
    //   {
    //     method: "POST",
    //     body: ticketFormData,
    //   }
    // )
    await startPaymentProcess({
      provider,
      amount: 1,
      idToken,
      ticketData: ticketState,
      domain: process.env.NEXT_PUBLIC_DOMAIN,
    })
      .then(async (responseObject:{data:any}) => {

        const transactionData = responseObject.data.response.response.data
        console.log(transactionData, "transactionData");
        

        const ticketWithID: TicketSchemaType = {
          ...ticketState,
          transactionID: transactionData.reference,
        } as TicketSchemaType;

        sessionStorage.setItem("ticket", JSON.stringify(ticketWithID));

        window.location.href = transactionData.authorization_url;
      })
      .catch((error) => {
        // setText(error);
        setHeaderText("Payment failed");
        setText(
          "There was a problem with your request. Please try again later."
        );
        setIsLoading(false);
        setIsOpen(true);

        console.log(error);

        return "error";
      });
  }

  setTimeout(() => {
    setLoadingBuffer(false);
  }, 500);

  if (isLoading || loadingBuffer) return <Loading />;

  return (
    <div
      className={`w-full bg-blue-50/15  relative overflow-y-hidden flex items-center   flex-col gap-2 p-2 ${comfortaa.className}`}
    >
      <div className="h-[65px] w-full  flex items-center justify-between font-bold text-[1.2rem]">
        <div className="" onClick={() => router.back()}>
          <ChevronLeft height="30px" width="30px" color={"red"} />
        </div>
        <div>Order Details</div>
        <SheetComponent />
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
      {ticketState && (
        <OrderSummary
          price={ticketState.price}
          quantity={ticketState.quantity}
        />
      )}
      <div id="recaptcha"></div>
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
      {/* <RadioGroupComponent
        data={Providers}
        valueState={providerState}
        setValueState={setProviderState}
      /> */}
      <Button
        disabled={isLoading}
        className="w-[9rem]"
        onClick={async () =>
          await handleOnClick(
            ticketState?.scans || 0,
            phoneNumber,
            providerState,
            ticketState?.price
          )
        }
      >
        Checkout
      </Button>
    </div>
  );
}
