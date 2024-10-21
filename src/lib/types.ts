export type TicketType = {
    name: string;
    startDate: string;
    endDate: string;
    eventID: string;
    tier: string;
    price: number;
    imageUrl: string;
    scans:number;
    uid:string;
    createdAt: Date;
    transactionID:string;
    ticketID:string;
  };
  
  export type EventType = {
    eventId: number;
    name: string;
    startDate: string;
    endDate: string;
    time : string;
    location: string;
    description: string;
    availableSeats: TicketType[];
    level?: string;
    categories: string[];
    imageUrl: string; 
    creatorMailAdress?:string | null |undefined
    createdAt?: string;
    fallBackMailAdress?: string;  
    userID: string;
  };

  