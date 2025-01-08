"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { generateRandomId, getCookie } from "../../../lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Selector } from "../../../../components/components/selector";
import { categoriesList } from "../../../../data/categories";
import { CategoriesComponent } from "../../../../components/components/events/categoriesComponent";
import { X } from "lucide-react";
import { z } from "zod";
import { User } from "firebase/auth";
import { AddTicket } from "../../../../components/components/events/AddTicket";
import TicketTierType, {
  AddNewTicket,
} from "../../../../components/components/eventInfo/ticketTierTypeComponent";
<<<<<<< HEAD
=======
import Cookies from "js-cookie";
import { comfortaa } from "@/app/page";
>>>>>>> feature/maps
import {
  EventSchemaType,
  EventSchemaType as EventType,
  AvailableSeatsType,
  EventSchema,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Vibrant } from "node-vibrant/browser";
import {
  rgbToHex,
  getLocationCoordiantes,
  convertTo12HourFormat,
} from "@/lib/utils";
import Loading from "@/app/loading";
import ShowPlaces from "../../../../components/components/mapComponents/showPlaces";
import { useLoadScript } from "@react-google-maps/api";
import Calendar from "../../../../components/components/calendar";
import { setDate } from "date-fns";

async function generatePallete(imageFile: File) {
  const imageUrl = URL.createObjectURL(imageFile);

  const image = new Image();
  image.src = imageUrl;

  return await Vibrant.from(image)
    .getPalette()
    .then((palette: any) => {
      console.log(palette, "palette");
      return palette;
    })
    .catch((err: any) => {
      console.log(String(err), "err");
      return null;
    });
}

type RequestType = EventType;

export const inputStyling =
  " bg-gray-50 rounded-3xl outline-none p-2 w-full h-[4rem] w-[20rem]";

export type createRequestType = Omit<RequestType, "imageUrl">;

async function sendCreateRequest({ event }: { event: createRequestType }) {
  const { imageFile, ...rest } = event;
  const requestFormData = new FormData();
  imageFile && requestFormData.append("imageFile", imageFile);
  requestFormData.append("rest", JSON.stringify(rest));

  console.log(event, "requestFormData");

  return await fetch("/api/data/create/event/", {
    method: "POST",
    body: requestFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data, "event data"))
    .catch((error) => {
      window.alert(`An error occured ${String(error)}`);
      console.log(error);
    });
}

// function AddTicket({
//   setAvailableSeatsState,
//   availableSeatsState,
//   seatsState,
//   setSeatsState,
// }: {
//   seatsState: AvailableSeatsType[];
//   setSeatsState: React.Dispatch<React.SetStateAction<AvailableSeatsType[]>>;
//   setAvailableSeatsState: React.Dispatch<
//     React.SetStateAction<AvailableSeatsType[]>
//   >;
//   availableSeatsState: AvailableSeatsType[];
// }) {
//   const [isAddingNewTicket, setIsAddingNewTicket] = useState<boolean>(false);

//   useEffect(() => {
//     availableSeatsState &&
//       setSeatsState((seatsState) => [
//         ...seatsState,
//         ...(availableSeatsState as AvailableSeatsType[]),
//       ]);
//   }, [availableSeatsState]);

//   function RemoveTicketType({ seat }: { seat: AvailableSeatsType }) {
//     setSeatsState((seatsState) =>
//       seatsState.filter((el) => el.tier !== seat.tier)
//     );
//   }

//   function AddTicketType(
//     ticketTier: string,
//     tierPrice: number,
//     tierQuantity: number
//   ) {
//     if (!ticketTier || !tierPrice || !tierQuantity) return;

//     if (seatsState.map((el) => el.tier).includes(ticketTier)) return;

//     setSeatsState((seatsState) => [
//       ...seatsState,
//       { tier: ticketTier, quantity: tierQuantity, price: tierPrice },
//     ]);
//   }

//   return (
//     <div>
//       {isAddingNewTicket ? (
//         <AddNewTicket
//           seatsState={seatsState}
//           setSeatsState={setSeatsState}
//           setIsAddingNewTicket={setIsAddingNewTicket}
//         />
//       ) : (
//         <Button onClick={() => setIsAddingNewTicket(true)}>Add New Tier</Button>
//       )}
//       {seatsState.map((el, i) => {
//         return (
//           <TicketTierType
//             RemoveTicketType={RemoveTicketType}
//             AddTicketType={AddTicketType}
//             seat={el}
//             key={el.tier}
//           />
//         );
//       })}
//     </div>
//   );
// }

export default function CreateEvent() {
  const [availableSeatsState, setAvailableSeatsState] = useState<
    AvailableSeatsType[]
  >([]);
  const [currentItem, setCurrentItem] = useState<string>("");
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [chosenCategoriesList, setChosenCategoriesList] =
    useState<JSX.Element[]>();
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  const [userInfoState, setUserInfoState] = useState<User>();
  const [locationDataState, setLocationDataState] = useState();
  const [startDateState, setStartDateState] = useState<Date | undefined>();
  const [endDateState, setEndDateState] = useState<Date | undefined>();
  const [eventNameState, setEventNameState] = useState<string>("");
  const [seatsState, setSeatsState] = useState<AvailableSeatsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isLoaded: mapIsLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });
  const [selected, setSelected] = useState({ id: 0, description: "" });
  const [selectedPlace, setSelectedPlace] = useState({
    place_id: "",
    description: "",
  });

  useEffect(() => {
<<<<<<< HEAD
    const userInfo = JSON.parse(sessionStorage.getItem("user") as string);

=======
    // const userInfo = JSON.parse(sessionStorage.getItem("user") as string);
    const userInfo = JSON.parse(Cookies.get("user") as string);
    // console.log(userInfo, "userInfo................");
>>>>>>> feature/maps
    setUserInfoState(userInfo);
  }, []);

  useEffect(() => {
    console.log(currentItem, "currentItem");

    categoriesState?.includes(currentItem) ||
      setCategoriesState((categoriesState) => [
        ...categoriesState,
        currentItem,
      ]);
  }, [currentItem]);

  useEffect(() => {
    console.log(categoriesState.length);

    setChosenCategoriesList(
      categoriesState?.map((category, i) => {
        if (category === "") return <div></div>;

        return (
          <CategoriesComponent
            currentItem={category}
            key={i}
            categoriesState={categoriesState}
            setCategoriesState={setCategoriesState}
          />
        );
      })
    );
  }, [categoriesState]);

  // function CategoriesComponent({ currentItem }: { currentItem: string }) {
  //   function handleOnClick() {
  //     const newCategories = categoriesState?.filter(
  //       (category) => category !== currentItem
  //     );
  //     setCategoriesState(newCategories);
  //   }

  //   return (
  //     <Button variant={"outline"} className="m-4">
  //       {currentItem}{" "}
  //       <X
  //         onClick={handleOnClick}
  //         height={"15px"}
  //         width={"15px"}
  //         className="mx-3"
  //       />
  //     </Button>
  //   );
  // }

  const FormValidEventSchema = z.object({
    // name: z.string(),
    // startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    // endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    province: z.string().min(3, "Province must be at least 3 characters"),
    mobile: z.string().regex(/^\+?\d{10,14}$/, "Invalid mobile number"),
    imageFile: z
      .instanceof(File)
      .refine(
        (file) => file.size < 5000000 || !file,
        "You must provide an image file less than 5MB"
      ),
    // location: z.string().min(3, "Location must be provided"),
    // imageFile :
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    time: z.string().min(1, "Time must be provided"),
  });

  // type FormValidEventSchema = Pick<EventSchemaType, "name" | "startDate" | "endDate" | "province" | "mobile" | "description" | "location" | "time"> & { imageFile: any };

  const form = useForm<z.infer<typeof FormValidEventSchema>>({
    resolver: zodResolver(FormValidEventSchema),
    defaultValues: {
      // name: "",
      // startDate: "",
      // endDate: "",
      province: "",
      mobile: "",
      imageFile: undefined,
      description: "",
      // location: "",
      time: "",
    },
  });

  const onSubmit = async (
    event: z.infer<Omit<typeof FormValidEventSchema, "imageFile">>
  ) => {
    const fileteredCategories = categoriesState.filter(
      (category) => category !== ""
    );

    console.log(imageFileState, "imageFileState");
    // console.log(event.imageFile.target.files[0], "event.imageFile.target.files");

    console.log(event, "event");
    const FormValidEventSchemaParseSuccess =
      FormValidEventSchema.safeParse(event).success;

    console.log(
      FormValidEventSchemaParseSuccess,
      "FormValidEventSchemaParseSuccess"
    );

    if (!startDateState || !endDateState) {
      window.alert("Please fill in the start and end date");
      return;
    }

    if(!eventNameState)

    if (!FormValidEventSchemaParseSuccess) {
      window.alert("Please fill in all the required fields");
      return;
    }

    if (categoriesState.length === 0) {
      window.alert("Please select a category");
      return;
    }

    if (seatsState.length === 0) {
      window.alert("Please add a ticket tier");
      return;
    }

    if (!selectedPlace) {
      window.alert("Please select a location");
      return;
    }

    const imagePallete = await generatePallete(imageFileState as File);

    console.log(selectedPlace.place_id, "place_id");

    const locationCoordinates = await getLocationCoordiantes(
      selectedPlace.place_id
    );

    console.log(imageFileState, "imageFileState");

    console.log(selectedPlace, "selectedPlace");

    event["time"] = convertTo12HourFormat(event["time"]);

    const eventWithExtraParams: EventSchemaType = {
      ...event,
      name: eventNameState,
      startDate: startDateState?.toISOString() || new Date().toISOString(),
      endDate: endDateState?.toISOString() || new Date().toISOString(),
      categories: fileteredCategories,
      availableSeats: seatsState,
      userID: userInfoState?.uid!,
      createdAt: new Date().toISOString(),
      eventId: Number(generateRandomId(5)),
      imageUrl: "",
      creator: {
        name: userInfoState?.displayName!,
        email: userInfoState?.email!,
        verified: userInfoState?.emailVerified!,
        uid: userInfoState?.uid!,
      },
      imagePallete,
      location: selectedPlace.description,
      locationCoordinates,
    };

    if (!eventWithExtraParams.userID) {
      window.alert("Please login to create an event");
      return;
    }

    console.log(eventWithExtraParams, "eventWithExtraParams");

    setIsLoading(true);

    // await sendCreateRequest({ event: eventWithExtraParams })
    //   .catch((err) => console.log(err, "err"))
    //   .then((res: any) => {
    //     if (res) {
    //       console.log(res, "res");
    //       window.location.href = "/myEvents";
    //     }
    //   })
    //   .finally(() => setIsLoading(false));
  };

  if (isLoading || !mapIsLoaded) return <Loading />;

  // function SubmitTest(e: any) {
  //   console.log(e);
  // }

  return (
    <div className="">
      <div className="h-[18rem] flex w-full flex-col p-4 gap-1">
        {/* <FormLabel>Event Name</FormLabel> */}
        <p className="text-sm font-medium">Event Name</p>
        <Input
          placeholder="Event Name"
          onChange={(e) => setEventNameState(e.target.value)}
        />
        <p className="text-sm font-medium">Start Date</p>

        <Calendar setDateState={setStartDateState} dateState={startDateState} />
        <p className="text-sm font-medium">End Date</p>

        <Calendar setDateState={setEndDateState} dateState={endDateState} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-4"
          id="createEventForm"
        >
          {
            <AddTicket
              setAvailableSeatsState={setAvailableSeatsState}
              availableSeatsState={availableSeatsState}
              seatsState={seatsState}
              setSeatsState={setSeatsState}
            />
          }
          <Selector
            label="Genre"
            items={categoriesList}
            setCurrentItemState={setCurrentItem}
          />
          <div className="w-full ">{chosenCategoriesList}</div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[7rem] relative">
            <FormLabel>Location</FormLabel>
            <ShowPlaces
              selected={selected}
              selectedPlace={selectedPlace}
              setSelected={setSelected}
              setSelectedPlace={setSelectedPlace}
            />
          </div>
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="Time" type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="+233" {...field} />
                </FormControl>
                <FormDescription>
                  This number will be used for payment disbursements and contact
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="imageFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ImageFile</FormLabel>
                <FormControl>
                  <Input
                    className={inputStyling}
                    type="file"
                    accept="image/*"
                    // max={"10000"}
                    placeholder="Image"
                    //commented because the added fields only accept strings
                    // {...field}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      file && setImageFileState(file as unknown as File);
                      if (file) {
                        form.setValue("imageFile", file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
