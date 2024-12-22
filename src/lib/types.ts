import { min } from "date-fns";
import { use } from "react";
import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const CreatorSchema = z.object({
  name: z.string(),
  uid: z.string(),
  email: z.string().email(),
  mobile: z
    .string()
    .optional()
    .refine(
      (mobile) => mobile && mobile.startsWith("+233") && mobile.length == 13
    ),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
  verified: z.boolean().default(false),
  bio: z.string().optional().describe("A short biography of the creator"),
  socialMediaLinks: z
    .array(z.string().url())
    .optional()
    .describe("Links to the creator's social media profiles"),
});

export type CreatorSchemaType = z.infer<typeof CreatorSchema>;

// export type TicketType = {
//   name: string;
//   startDate: string;
//   endDate: string;
//   eventID: string;
//   tier: string;
//   price: number;
//   imageUrl: string;
//   scans: number;
//   uid: string;
//   createdAt: Date;
//   transactionID: string;
//   ticketID: string;
// };

// export type EventType = {
//   eventId: number;
//   name: string;
//   startDate: string;
//   endDate: string;
//   time: string;
//   location: string;
//   description: string;
//   availableSeats: TicketType[];
//   level?: string;
//   categories: string[];
//   imageUrl: string;
//   creatorMailAdress?: string | null | undefined;
//   createdAt?: string;
//   fallBackMailAdress?: string;
//   userID: string;
// };

export type EventSchemaType = z.infer<typeof EventSchema>;

// export const TicketSchema = z.object({
//   name: z.string(),
//   startDate: z.date(),
//   endDate: z.date(),
//   eventID: z.string(),
//   tier: z.string(),
//   price: z.number(),
//   imageUrl: z.string(),
//   scans: z.number(),
//   uid: z.string(),
//   createdAt: z.date(),
//   transactionID: z.string(),
//   ticketID: z.string(),
// });

const TicketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  startDate: z.date().refine(
    (date) => date >= new Date(),
    { message: "Start date must be a future date" }
  ),
  endDate: z.date().refine(
    (date) => date >= new Date(),
    { message: "End date must be a future date" }
  ),
  eventID: z.string().min(1, "Event ID is required"),
  tier: z.string().min(1, "Tier is required"),
  price: z.number().min(0, "Price must be a positive number"),
  imageUrl: z.string().url("Must be a valid URL"),
  scans: z.number().min(0, "Scans must be a non-negative number"),
  uid: z.string().min(1, "User ID is required"),
  createdAt: z.date().default(new Date()),
  transactionID: z.string().min(1, "Transaction ID is required"),
  ticketID: z.string().min(1, "Ticket ID is required"),
  purchaseDate: z.date().describe("The date when the ticket was purchased"),
  seatNumber: z.string().optional().describe("The seat number assigned to the ticket"),
  status: z.enum(['active', 'used', 'cancelled']).describe("The current status of the ticket"),
  buyerID: z.string().describe("The unique identifier of the ticket buyer"),
});

export type TicketSchemaType = z.infer<typeof TicketSchema>;

export const AvailableSeatsSchema = z.object({
  tier: z.string(),
  price: z.number(),
  quantity: z.number().optional(),
  number: z.number().optional(),
});

export const EventSchema = z
  .object({
    eventId: z.number(),
    name: z
      .string()
      .min(1, {
        message:
          "name must be at least 1 character long, between 10 and 20 characters recommended",
      })
      .max(50, { message: "The name should have less than 50 characters" }),

    startDate: z
      .string()
      .date()
      .refine(
        (date) => {
          return (
            datePattern.test(date) && new Date(date) < new Date(Date.now())
          );
        },
        { message: "The start date is invalid" }
      ),

    endDate: z
      .string()
      .date()
      .refine(
        (date) => {
          return (
            datePattern.test(date) && new Date(date) < new Date(Date.now())
          );
        },
        { message: "The end date is invalid" }
      ),
    time: z.string(),
    location: z.string(),
    description: z.string(),
    availableSeats: z.array(AvailableSeatsSchema),
    categories: z.array(z.string()),
    imageFile: z.any(),
    // creatorMailAdress: z.string().email(),
    createdAt: z.string().date(),
    imageUrl: z.string().url(),
    // fallBackMailAdress: z.string().email(),
    userID: z.string(),
    province: z.string().optional(),
    // image: z.string().nonempty(),
    mobile: z
      .string()
      .refine((mobile) => mobile.startsWith("+233") && mobile.length == 13),
    creator: CreatorSchema.optional(),
  })
//   .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
//     message: "Start date must be before end date",
//     path: ["endDate"],
//   }).refine((data) => data.categories.length > 0, {
//     message: "At least one category is required",
//   })
//  .refine(data => data.imageFile || data.imageUrl, {
//     message: "An image is required",
//   });


export type AvailableSeatsType = z.infer<typeof AvailableSeatsSchema>;
