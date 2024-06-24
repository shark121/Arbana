"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RadioGroupComponent from "../../../../components/ui/radioGroup";
import { Input } from "@/components/ui/input";
import DialogComponent from "../../../../components/ui/dialog";
import Counter from "../../../../components/ui/counter";
import QRcode from "qrcode";
import { generateRandomId } from "@/lib/utils";

const Providers = [
  { label: "MTN", value: "MTN" },
  { label: "Vodafone", value: "Vodafone" },
  { label: "AirtelTigo", value: "AirtelTigo" },
  { label: "Glo", value: "Glo" },
];

export default function Booking({ params }: { params: {} }) {
  const [providerState, setProviderState] = useState<string>("MTN");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<number>(1);
  const [ticketState, setTicketState] = useState<{
    name: string;
    date: string;
    eventID: string;
    tier: string;
    price: number;
  }>();
  const [headerText, setHeaderText] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

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

    // await fetch(`http://localhost:3000/api/data/read/getTickets/${quantity}`)
    //   .then(async (response) => {
    //     let text = await response.json();
    //     console.log(text);
    //     if (text.response === false) {
    //       setText(
    //         "We cannot satisfy your order at this time, please try again later."
    //       );
    //       setHeaderText("Insufficient tickets");
    //       setIsOpen(true);
    //       return "error";
    //     }
    //   })
    //   .catch((error) => {
    //     // console.log(error);
    //     setText("There was an error completing your request.");
    //     setHeaderText("Error");
    //     setIsOpen(true);
    //     return "error";
    //   })
    //   .then(async () => {
    //     await fetch(
    //       `http://localhost:3000/api/payment/request/${phoneNumber}/${provider}/${price}`
    //     )
    //       .then(async (response) => {
    //         let text = await response.json();
    //         console.log(text);
    //         if (text.response === false) {
    //           setText("Payment failed, please try again later.");
    //           setHeaderText("Payment failed");
    //           setIsOpen(true);
    //           return "error";
    //         }

    //         const ticketWithID = { ...ticketState, ticketID: text.response };
    //         sessionStorage.setItem("ticket", JSON.stringify(ticketWithID));

    //         const verificationID = generateRandomId(10);
    //         sessionStorage.setItem("verificationID", verificationID);

    //         window.location.href = `/ticket/${text.response}/${verificationID}`;
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //         setText(String(error));
    //         setHeaderText("Payment failed");
    //         return "error";
    //       });
    //   });
    const text = {response : generateRandomId(10)};

    const ticketWithID = { ...ticketState, ticketID: text.response, quantity };
    sessionStorage.setItem("ticket", JSON.stringify(ticketWithID));

    const verificationID = generateRandomId(10);
    sessionStorage.setItem("verificationID", verificationID);

    window.location.href = `/ticket/${text.response}/${verificationID}`;
  }

  return (
    <div className="w-screen h-screen relative overflow-y-hidden flex items-center justify-center flex-col gap-8">
      <div className=" h-[2rem]">{ticketState?.name}</div>
      <div>{ticketState?.date}</div>
      <div>{ticketState?.tier}</div>
      <div className="w-full h-[5rem]">
        {ticketState && (
          <Counter
            max={2}
            id={ticketState?.eventID}
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
          />
        )}
      </div>

      <div className="relative -z-10">
        <DialogComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          headerText={headerText}
          text={text}
        />
      </div>
      <Input
        placeholder="Enter phone number"
        className="w-[15rem]"
        type="number"
        max={10}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <RadioGroupComponent
        data={Providers}
        valueState={providerState}
        setValueState={setProviderState}
      />
      <Button
        onClick={async () =>
          await handleOnClick(
            defaultValue,
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
