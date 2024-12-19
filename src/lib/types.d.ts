import {z} from "zod"


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


export const TicketSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  eventID: z.string(),
  tier: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  scans:z.number(),
  uid:z.string(),
  createdAt: z.date(),
  transactionID:z.string(),
  ticketID:z.string()
})
  

export const AvailableSeatsSchema = z.object({ 
    tier : z.string(),
    price : z.number(),
    quantity : z.number()
})


export const EventSchema = z.object({
  eventId: z.number(),
  name: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  time : z.string().time(),
  location: z.string(),
  description: z.string(),
  availableSeats: z.array(AvailableSeatsSchema),
  categories: z.array(z.string()),
  imageUrl: z.string(),
  creatorMailAdress : z.string().email(),
  createdAt: z.string().date(),
  fallBackMailAdress?: z.string().email(),
  userID: z.string()
})