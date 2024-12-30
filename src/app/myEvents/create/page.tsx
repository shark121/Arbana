"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { generateRandomId, getCookie } from "../../../lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Selector } from "../../../../components/components/selector";
import { categoriesList } from "../../../../data/categories";
import { X } from "lucide-react";
import { z } from "zod";
import { User } from "firebase/auth";
import TicketTierType, {
  AddNewTicket,
} from "../../../../components/components/eventInfo/ticketTierTypeComponent";
import { comfortaa } from "@/app/page";
import {
  EventSchemaType,
  EventSchemaType as EventType,
  AvailableSeatsType,
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
import { rgbToHex } from "@/lib/utils";
import Loading from "@/app/loading";

async function genertePallete(imageFile: File) {
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
export default function CreateEvent() {
  const [availableSeatsState, setAvailableSeatsState] = useState<
    AvailableSeatsType[]
  >([]);
  const [currentItem, setCurrentItem] = useState<string>("");
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [chosenCategoriesList, setChosenCategoriesList] =
    useState<JSX.Element[]>();
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  const [eventIDState, setEventIDState] = useState<number>(
    Number(generateRandomId(5))
  );
  const [userInfoState, setUserInfoState] = useState<User>();
  const [fallBackMailAdressState, setFallBackMailAdressState] =
    useState<string>("");
  const [seatsState, setSeatsState] = useState<AvailableSeatsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const eventNameRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("user") as string);

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

    const imagePallete = await genertePallete(imageFileState as File);

    console.log(imageFileState, "imageFileState");

    const eventWithExtraParams: EventSchemaType = {
      ...event,
      categories: fileteredCategories,
      availableSeats: seatsState,
      userID: userInfoState?.uid!,
      createdAt: new Date().toISOString(),
      eventId: eventIDState,
      imageUrl: "",
      creator: {
        name: userInfoState?.displayName!,
        email: userInfoState?.email!,
        verified: userInfoState?.emailVerified!,
        uid: userInfoState?.uid!,
      },
      imagePallete,
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

    setIsLoading(true);

    sendCreateRequest({ event: eventWithExtraParams })
      .catch((err) => console.log(err, "err"))
      .then((res: any) => {
        if (res.response === "success") {
          window.location.href = "/myEvents";
        }
      })
      .finally(() => setIsLoading(false));

    // form.reset();
    // setSeatsState([]);
    // setChosenCategoriesList([]);
    // setImageFileState(null);
  };

  if (isLoading) return <Loading />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4"
        id="createEventForm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
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
