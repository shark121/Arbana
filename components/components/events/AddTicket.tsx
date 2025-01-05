import { AvailableSeatsType } from "@/lib/types";
import {useState, useEffect} from "react";
import TicketTierType from "../eventInfo/ticketTierTypeComponent";
import { Button } from "@/components/ui/button";
import { AddNewTicket } from "../eventInfo/ticketTierTypeComponent";

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
      availableSeatsState &&
        setSeatsState((seatsState) => [
          ...seatsState,
          ...(availableSeatsState as AvailableSeatsType[]),
        ]);
    }, [availableSeatsState]);
  
    function RemoveTicketType({ seat }: { seat: AvailableSeatsType }) {
      setSeatsState((seatsState) =>
        seatsState.filter((el) => el.tier !== seat.tier)
      );
    }
  
    function AddTicketType(
      ticketTier: string,
      tierPrice: number,
      tierQuantity: number
    ) {
      if (!ticketTier || !tierPrice || !tierQuantity) return;
  
      if (seatsState.map((el) => el.tier).includes(ticketTier)) return;
  
      setSeatsState((seatsState) => [
        ...seatsState,
        { tier: ticketTier, quantity: tierQuantity, price: tierPrice },
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
          <Button onClick={() => setIsAddingNewTicket(true)}>Add New Tier</Button>
        )}
        {seatsState.map((el, i) => {
          return (
            <TicketTierType
              RemoveTicketType={RemoveTicketType}
              AddTicketType={AddTicketType}
              seat={el}
              key={el.tier}
            />
          );
        })}
      </div>
    );
  }