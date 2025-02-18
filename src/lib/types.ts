import { z } from "zod";
import {User} from "firebase/auth"

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const CreatorSchema = z.object({
  name: z.string(),
  uid: z.string(),
  email: z.string().email(),
  mobile: z
    .string()
    .optional()
    .refine(
      (mobile) => mobile && mobile.length == 10
    ),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
  verified: z.boolean().default(false),
  bio: z.string().optional().describe("A short biography of the creator"),
  socialMediaLinks: z
    .object({
      twitter: z.string().url(),
      facebook: z.string().url(),
      instagram: z.string().url(),
      linkedin: z.string().url(),
    })
    .optional()
    .describe("Links to the creator's social media profiles"),
});

export type CreatorSchemaType = z.infer<typeof CreatorSchema>;

export type EventSchemaType = z.infer<typeof EventSchema>;


const TicketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  startDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: "Start date must be a future date",
  }),
  endDate: z.string().refine((date) => new Date(date) >= new Date(), {
    message: "End date must be a future date",
  }),
  eventID: z.string().min(1, "Event ID is required"),
  tier: z.string().min(1, "Tier is required"),
  price: z.number().min(0, "Price must be a positive number"),
  quantity: z.number().min(1, "Quantity must be a positive number"),
  imageUrl: z.string().url("Must be a valid URL"),
  scans: z.number().min(0, "Scans must be a non-negative number"),
  uid: z
    .string()
    .min(1, "User ID is required")
    .describe("The unique identifier of the ticket buyer"),
  createdAt: z.string().default(new Date().toISOString()),
  transactionID: z.string().min(1, "Transaction ID is required"),
  ticketID: z.string().min(1, "Ticket ID is required"),
  purchaseDate: z
    .string()
    .optional()
    .describe("The date when the ticket was purchased"),
  seatNumber: z
    .string()
    .optional()
    .describe("The seat number assigned to the ticket"),
  locationCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .describe("The coordinates of the ticket"),
  groupNumber: z.number().optional().describe("The group number of the ticket"),

  // status: z
  //   .enum(["active", "used", "cancelled"])
  //   .describe("The current status of the ticket"),
});

export type TicketSchemaType = z.infer<typeof TicketSchema>;

export const AvailableSeatsSchema = z.object({
  tier: z.string(),
  price: z.number(),
  quantity: z.number(),
  groupNumber: z.number().nullish().optional(),
});

export const PaleteSchema = z.object({
  Vibrant: z.object({ rgb: z.tuple([z.number(), z.number(), z.number()]) }),
});

export type PaleteSchemaType = z.infer<typeof PaleteSchema>;

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
    province: z.string(),
    imagePallete: PaleteSchema,
    // image: z.string().nonempty(),
    mobile: z
      .string()
      .refine((mobile) => mobile.startsWith("+233") && mobile.length == 13),
    creator: CreatorSchema,
    locationCoordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional()
      .describe("The coordinates of the ticket"),
    locationId: z.string(),
  })
  .strict();
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

export const PermissionsTypeSchema = z.object({
  canEdit: z.boolean(),
  canDelete: z.boolean().optional(),
  canView: z.boolean().optional(),
  canScan: z.boolean(),
  canAddToTeam: z.boolean().optional(),
  canViewStats: z.boolean(),
});

export type PermissionsSchemaType = z.infer<typeof PermissionsTypeSchema>;

export type TeamDataType = Record<
  string,
  { info: CreatorSchemaType; permissions: PermissionsSchemaType }
>;


const scanResultSchema = z.object({
  scans: z.number().nullish(),
  quantity: z.number().nullish(),
  err: z.string().optional().nullish(),
  ticketData: TicketSchema.nullish(),
})


export type scanResultType = z.infer<typeof scanResultSchema>

export type LocalUserType =  User & {token: string}


export type UserInfo = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  providerData: any; // Consider typing this further if possible
};

export type UserInfoWithToken = UserInfo & {
  token: any; // Consider typing this further if possible (e.g., IdTokenResult)
};

export type AdditionalUserInfo = {
  isNewUser: boolean;
};

export type UserData = {
  accountInfo: {
    name: string | null;
    uid: string;
    email: string | null;
    emailVerified: boolean;
  };
  events: any[]; // Consider typing these arrays further
  tickets: any[];
  followers: any[];
  following: any[];
};
