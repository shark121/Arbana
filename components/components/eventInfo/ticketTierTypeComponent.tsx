"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TicketType } from "../../ui/eventComponent";
import { AvailableSeatsType } from "@/lib/types";
import { z } from "zod";
import { group } from "console";

export const inputStyling =
  " bg-gray-50 rounded-2xl outline-none p-2 w-full h-[3rem] m-2";

export default function TicketTierType({
  seat,
  RemoveTicketType,
  AddTicketType,
}: {
  seat: AvailableSeatsType;
  RemoveTicketType: ({ seat }: { seat: AvailableSeatsType }) => void;
  AddTicketType: (
    ticketTier: string,
    tierPrice: number,
    tierQuantity: number,
    groupNumber: number
  ) => void;
}) {
  const [ticketTier, setTicketTier] = useState<string>("");
  const [tierPrice, setTierPrice] = useState<number>(0);
  const [tierQuantity, setTierQuantity] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(true);
  const groupNumber = seat.groupNumber ? seat.groupNumber : 1;

  return (
    <div className="flex flex-col gap-2 items-center justify-center my-4">
      <Input
        placeholder="Ticket Tier"
        required={true}
        defaultValue={seat.tier}
        onChange={(e) => setTicketTier(e.target.value)}
        readOnly={true}
        className={inputStyling}
      />
      <Input
        placeholder="Ticket Price"
        defaultValue={seat.price}
        required={true}
        type="number"
        onChange={(e) => setTierPrice(Number(e.target.value))}
        readOnly={true}
        className={inputStyling}
      />
      <Input
        placeholder="Ticket Quantity"
        defaultValue={seat.quantity}
        required={true}
        type="number"
        onChange={(e) => setTierQuantity(Number(e.target.value))}
        readOnly={true}
        className={inputStyling}
      />
      {seat.groupNumber && (
        <Input
          placeholder="Ticket Quantity"
          defaultValue={seat.groupNumber}
          required={true}
          type="number"
          onChange={(e) => setTierQuantity(Number(e.target.value))}
          readOnly={true}
          className={inputStyling}
        />
      )}

      {isAdded ? (
        <Button onClick={(e) => RemoveTicketType({ seat })}>
          Remove Ticket
        </Button>
      ) : (
        <Button
          className="self-center"
          onClick={(e) => {
            if (!(ticketTier && tierPrice && tierQuantity)) {
              window.alert("Please fill all required ticket fields");
              return;
            }

            AddTicketType(ticketTier, tierPrice, tierQuantity, groupNumber);
            setIsAdded(true);
          }}
        >
          Add Tier
        </Button>
      )}
    </div>
  );
}

export function AddNewTicket({
  seatsState,
  setSeatsState,
  setIsAddingNewTicket,
}: {
  seatsState: AvailableSeatsType[];
  setSeatsState: React.Dispatch<React.SetStateAction<AvailableSeatsType[]>>;
  setIsAddingNewTicket: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [ticketTier, setTicketTier] = useState<string>("");
  const [tierPrice, setTierPrice] = useState<number>(0);
  const [tierQuantity, setTierQuantity] = useState<number>(0);
  const [groupNumber, setGroupNumber] = useState<number>(1);

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <Input
        placeholder="Ticket Tier"
        required={true}
        onChange={(e) => setTicketTier(e.target.value)}
        className={inputStyling}
      />
      <Input
        placeholder="Ticket Price"
        required={true}
        type="number"
        onChange={(e) => setTierPrice(Number(e.target.value))}
        className={inputStyling}
      />
      <Input
        placeholder="Ticket Quantity"
        required={true}
        type="number"
        onChange={(e) => setTierQuantity(Number(e.target.value))}
        className={inputStyling}
      />
      <Input
        placeholder="Number per group"
        required={true}
        type="number"
        onChange={(e) => setGroupNumber(Number(e.target.value))}
        className={inputStyling}
      />

      <Button
        type="button"
        onClick={() => {
          if (!(ticketTier && tierPrice && tierQuantity && (groupNumber > 0))) {
            window.alert("Please fill all required ticket fields");
            return;
          }

          setSeatsState((seatsState) => [
            ...seatsState,
            {
              tier: ticketTier,
              price: tierPrice,
              quantity: tierQuantity,
              groupNumber: groupNumber,
            },
          ]);

          setIsAddingNewTicket(false);
        }}
      >
        Add Ticket
      </Button>
    </div>
  );
}
