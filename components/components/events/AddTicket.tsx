import { useState, useEffect } from "react";
import TicketTierType from "../eventInfo/ticketTierTypeComponent";
import { Button } from "@/components/ui/button";
import { AddNewTicket } from "../eventInfo/ticketTierTypeComponent";
import { AvailableSeatsType } from "@/lib/types";
import { group } from "console";

export function AddTicket({
  setAvailableSeatsState,
  availableSeatsState,
  seatsState,
  setSeatsState,
}: {
  seatsState: AvailableSeatsType[];
  setSeatsState: React.Dispatch<React.SetStateAction<AvailableSeatsType[]>>;
  setAvailableSeatsState: React.Dispatch<
    React.SetStateAction<AvailableSeatsType[]>
  >;
  availableSeatsState: AvailableSeatsType[];
}) {
  const [isAddingNewTicket, setIsAddingNewTicket] = useState<boolean>(false);

  useEffect(() => {
    if (availableSeatsState) {
      setSeatsState((prevSeatsState) => {
        const existingTiers = new Set(prevSeatsState.map((seat) => seat.tier));
        const newSeats = availableSeatsState.filter(
          (seat) => !existingTiers.has(seat.tier)
        );
        return [...prevSeatsState, ...newSeats];
      });
    }
  }, [availableSeatsState]);

  function RemoveTicketType({ seat }: { seat: AvailableSeatsType }) {
    setSeatsState((seatsState) =>
      seatsState.filter((el) => el.tier !== seat.tier)
    );
  }

  function AddTicketType(
    ticketTier: string,
    tierPrice: number,
    tierQuantity: number,
    groupNumber: number
  ) {
    // Validate inputs
   
    console.log(ticketTier, tierPrice, tierQuantity, "............");

    if (!ticketTier.trim()) {
      console.error("Ticket Tier cannot be empty.");
      return;
    }
    if (tierPrice < 0) {
      console.error("Price must be a positive number.");
      return;
    }
    if (tierQuantity <= 0) {
      console.error("Quantity must be a positive number.");
      return;
    }
  
    // Check if the ticket tier already exists
    if (seatsState.some((el) => el.tier === ticketTier)) {
      console.error(`Tier "${ticketTier}" already exists.`);
      return;
    }
  
    // Add the new ticket
    setSeatsState((seatsState) => [
      ...seatsState,
      { tier: ticketTier, quantity: tierQuantity, price: tierPrice, groupNumber },
    ]);
  }
  

  return (
    <div>
      {isAddingNewTicket ? (
        <AddNewTicket
          seatsState={seatsState}
          setSeatsState={setSeatsState}
          setIsAddingNewTicket={setIsAddingNewTicket}
        />
      ) : (
        <Button type="button" onClick={() => setIsAddingNewTicket(true)}>
          Add New Tier
        </Button>
      )}
      {seatsState.map((el) => (
        <TicketTierType
          RemoveTicketType={RemoveTicketType}
          AddTicketType={AddTicketType}
          seat={el}
          key={el.tier}
        />
      ))}
    </div>
  );
}
