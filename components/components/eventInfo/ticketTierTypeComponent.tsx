"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TicketType } from "../../ui/eventComponent";

export default function TicketTierType({
  seat,
  RemoveTicketType,
  AddTicketType,
}: {
  seat: TicketType;
  RemoveTicketType: ({ seat }: { seat: TicketType }) => void;
  AddTicketType: (
    ticketTier: string,
    tierPrice: number,
    tierQuantity: number
  ) => void;
}) {
  const [ticketTier, setTicketTier] = useState<string>("");
  const [tierPrice, setTierPrice] = useState<number>(0);
  const [tierQuantity, setTierQuantity] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(true);

  return (
    <div className="flex flex-col gap-4 w-full ">
      <Input
        placeholder="Ticket Tier"
        required={true}
        defaultValue={seat.tier}
        onChange={(e) => setTicketTier(e.target.value)}
        readOnly={true}
      />
      <Input
        placeholder="Ticket Price"
        defaultValue={seat.price}
        required={true}
        type="number"
        onChange={(e) => setTierPrice(Number(e.target.value))}
        readOnly={true}
      />
      <Input
        placeholder="Ticket Quantity"
        defaultValue={seat.number}
        required={true}
        type="number"
        onChange={(e) => setTierQuantity(Number(e.target.value))}
        readOnly={true}
      />
      {isAdded ? (
        <Button onClick={(e) => RemoveTicketType({ seat })}>
          Remove Ticket
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            AddTicketType(ticketTier, tierPrice, tierQuantity);
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
  seatsState: TicketType[];
  setSeatsState: React.Dispatch<React.SetStateAction<TicketType[]>>;
  setIsAddingNewTicket: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [ticketTier, setTicketTier] = useState<string>("");
  const [tierPrice, setTierPrice] = useState<number>(0);
  const [tierQuantity, setTierQuantity] = useState<number>(0);

  return (
    <div>
      <Input
        placeholder="Ticket Tier"
        required={true}
        onChange={(e) => setTicketTier(e.target.value)}
      />
      <Input
        placeholder="Ticket Price"
        required={true}
        type="number"
        onChange={(e) => setTierPrice(Number(e.target.value))}
      />
      <Input
        placeholder="Ticket Quantity"
        required={true}
        type="number"
        onChange={(e) => setTierQuantity(Number(e.target.value))}
      />
      <Button
        onClick={() => {
          setSeatsState((seatsState) => [
            ...seatsState,
            { tier: ticketTier, price: tierPrice, number: tierQuantity },
          ]);

          setIsAddingNewTicket(false);
        }}
      >
        Add Ticket
      </Button>
    </div>
  );
}
