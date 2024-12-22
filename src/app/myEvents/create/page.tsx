"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import CalendarForm from "../../../../components/components/calendar";
import { TicketType } from "../../../../components/ui/eventComponent";
import { generateRandomId, getCookie } from "../../../lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Selector } from "../../../../components/components/selector";
import { categoriesList } from "../../../../data/categories";
import { X } from "lucide-react";
import { z } from "zod";
// import { EventType } from "../../../../components/ui/eventComponent";
import { User } from "firebase/auth";
import { runTransaction } from "firebase/firestore";
import TicketTierType, {
  AddNewTicket,
} from "../../../../components/components/eventInfo/ticketTierTypeComponent";
import { comfortaa } from "@/app/page";
import { EventSchemaType as EventType } from "@/lib/types";
import EventForm from "../../../../components/components/form";
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

type RequestType = EventType 

export const inputStyling =
  " bg-gray-50 rounded-3xl outline-none p-2 w-full h-[4rem] w-[20rem]";

export type createRequestType = Omit<RequestType, "imageUrl">;

async function sendCreateRequest({ event }: { event: createRequestType }) {
  const { imageFile, ...rest } = event;
  const requestFormData = new FormData();
  imageFile && requestFormData.append("imageFile", imageFile);
  requestFormData.append("rest", JSON.stringify(rest));

  console.log(event, "requestFormData");

  await fetch("/api/data/create/event/", {
    method: "POST",
    body: requestFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

function AddTicket({
  setAvailableSeatsState,
  availableSeatsState,
  seatsState,
  setSeatsState,
}: {
  seatsState: TicketType[];
  setSeatsState: React.Dispatch<React.SetStateAction<TicketType[]>>;
  setAvailableSeatsState: React.Dispatch<React.SetStateAction<TicketType[]>>;
  availableSeatsState: TicketType[];
}) {
  const [isAddingNewTicket, setIsAddingNewTicket] = useState<boolean>(false);

  useEffect(() => {
    availableSeatsState &&
      setSeatsState((seatsState) => [
        ...seatsState,
        ...(availableSeatsState as TicketType[]),
      ]);
  }, [availableSeatsState]);

  function RemoveTicketType({ seat }: { seat: TicketType }) {
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
      { tier: ticketTier, number: tierQuantity, price: tierPrice },
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
export default function CreateEvent() {
  // const [eventNameState, setEventNameState] = useState<string>("");
  // const [startDateState, setStartDateState] = useState<string>("");
  // const [provinceState, setProvinceState] = useState<string>("");
  // const [endDateState, setEndDateState] = useState<string>("");
  // const [startTimeState, setStartTimeState] = useState<string>("00:00");
  // const [locationState, setLocationState] = useState<string>("");
  // const [descriptionState, setDescriptionState] = useState("");
  const [availableSeatsState, setAvailableSeatsState] = useState<TicketType[]>(
    []
  );
  const [currentItem, setCurrentItem] = useState<string>("");
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [chosenCategoriesList, setChosenCategoriesList] =
    useState<JSX.Element[]>();
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  // const [createdEvent, setCreateEvent] = useState<EventType>();
  const [eventIDState, setEventIDState] = useState<number>(
    Number(generateRandomId(5))
  );
  const [userInfoState, setUserInfoState] = useState<User>();
  const [fallBackMailAdressState, setFallBackMailAdressState] =
    useState<string>("");
  const [seatsState, setSeatsState] = useState<TicketType[]>([]);
  const eventNameRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(getCookie("user") as string);

    // console.log(userInfo, "userInfo................");
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

        return <CategoriesComponent currentItem={category} key={i} />;
      })
    );
  }, [categoriesState]);

  function CategoriesComponent({ currentItem }: { currentItem: string }) {
    function handleOnClick() {
      const newCategories = categoriesState?.filter(
        (category) => category !== currentItem
      );
      setCategoriesState(newCategories);
    }

    return (
      <Button variant={"outline"} className="m-4">
        {currentItem}{" "}
        <X
          onClick={handleOnClick}
          height={"15px"}
          width={"15px"}
          className="mx-3"
        />
      </Button>
    );
  }

  // async function handleCreateEvent() {
  //   const fileteredCategories = categoriesState.filter(
  //     (category) => category !== ""
  //   );

  //   const userIDAsString = userInfoState?.uid as string;

  //   console.log(userIDAsString, "user ID");

  //   console.log(fileteredCategories);

  //   const event: Omit<RequestType, "imageUrl"> = {
  //     name: eventNameState,
  //     startDate: startDateState,
  //     endDate: endDateState,
  //     location: locationState,
  //     description: descriptionState,
  //     categories: fileteredCategories,
  //     availableSeats: seatsState,
  //     eventId: eventIDState,
  //     time: startTimeState,
  //     imageFile: imageFileState,
  //     createdAt: new Date().toISOString(),
  //     creatorMailAdress: userInfoState?.email,
  //     fallBackMailAdress: fallBackMailAdressState,
  //     province: provinceState,
  //     userID: userIDAsString,
  //   };

  //   console.log(event, "event");

  //   const date = z.string().date();

  //   eventNameRef && console.log(eventNameRef.current);

  //   // await sendCreateRequest({ event }).catch((err) => console.log(err, "err"));
  // }

  // image is set to any because of the file type
  // validation is done manually

  const FormValidEventSchema = z.object({
    name: z.string(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    province: z.string(),
    mobile: z.string().regex(/^\+?\d{10,14}$/, "Invalid mobile number"),
    imageFile: z.any(),
    // imageFile :
    description: z.string(),
    location: z.string(),
    time: z.string(),
  });

  const form = useForm<z.infer<typeof FormValidEventSchema>>({
    resolver: zodResolver(FormValidEventSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      province: "",
      mobile: "",
      // imageFile: "",
      description: "",
      time: "",
    },
  });

  type ExtraParams = z.infer<typeof FormValidEventSchema> & {
    imageFile?: File;
    categories: string[];
    eventId: number;
    availableSeats: TicketType[];
    userID: string;
    createdAt: string;
  };

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

    console.log(imageFileState, "imageFileState");

    const eventWithExtraParams: ExtraParams = {
      ...event,
      categories: fileteredCategories,
      availableSeats: seatsState,
      userID: userInfoState?.uid!,
      createdAt: new Date().toISOString(),
      eventId: eventIDState,
    };

    console.log(eventWithExtraParams, "eventWithExtraParams");

    if (!FormValidEventSchemaParseSuccess) {
      window.alert("Please fill in all the required fields");
      return;
    }

    if (!eventWithExtraParams.userID) {
      window.alert("Please login to create an event");
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

    // console.log("Form Data:", event);

    // console.log("Collected Data:", collectedData);

    sendCreateRequest({ event: eventWithExtraParams }).catch((err) =>
      console.log(err, "err")
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        id="createEventForm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input placeholder="Time" {...field} />
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
              <FormLabel>imageFile</FormLabel>
              <FormControl>
                <Input
                  className={inputStyling}
                  type="file"
                  accept="image/*"
                  max={"10000"}
                  placeholder="Image"
                  //commented because the added fields only accept strings
                  // {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    file && setImageFileState(file as unknown as File);
                    form.setValue("imageFile", file);
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
  );
}
