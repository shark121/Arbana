"use client";

import { collection, getDoc, doc } from "firebase/firestore";
import { database } from "@/firebase.config";
import ScanQRCode from "../../scan/[[...data]]/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { generateRandomId, getCookie } from "../../../lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Selector } from "../../../../components/components/selector";
import { categoriesList } from "../../../../data/categories";
import { X } from "lucide-react";
import z from "zod";
import { User } from "firebase/auth";
import TicketPopOver from "../../../../components/components/ticketPopOver";
import TicketTierType, {
  AddNewTicket,
} from "../../../../components/components/eventInfo/ticketTierTypeComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EventSchema,
  EventSchemaType,
  AvailableSeatsSchema,
  AvailableSeatsType,
} from "@/lib/types";

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
import Verified from "@/images/svg/verified";

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

async function sendUpdateRequest({ event }: { event: EventSchemaType }) {
  const { imageFile, ...rest } = event;
  const requestFormData = new FormData();
  imageFile && requestFormData.append("imageFile", imageFile);
  requestFormData.append("rest", JSON.stringify(rest));

  await fetch("/api/data/update/user_events/", {
    method: "POST",
    body: requestFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

type RequestType = EventSchemaType & { imageFile: File | null };

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
      {isAddingNewTicket ? (
        <AddNewTicket
          seatsState={seatsState}
          setSeatsState={setSeatsState}
          setIsAddingNewTicket={setIsAddingNewTicket}
        />
      ) : (
        <Button onClick={() => setIsAddingNewTicket(true)}>Add New Tier</Button>
      )}
    </div>
  );
}

export default function EventInfo(params: {
  params: { data: [eventId: string] };
}) {
  const [eventState, setEventState] = useState<EventSchemaType>();

  useEffect(() => {
    getDoc(doc(collection(database, "events"), params.params.data[0])).then(
      (doc) => {
        console.log(doc.data());
        setEventState(doc.data() as EventSchemaType);
      }
    );
  }, []);

  const [availableSeatsState, setAvailableSeatsState] = useState<
    AvailableSeatsType[]
  >([]);
  const [currentItem, setCurrentItem] = useState<string>("");
  const [seatsState, setSeatsState] = useState<AvailableSeatsType[]>([]);
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [chosenCategoriesList, setChosenCategoriesList] =
    useState<JSX.Element[]>();
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  const [eventIDState, setEventIDState] = useState<number>(
    Number(generateRandomId(20))
  );
  const [userInfoState, setUserInfoState] = useState<User>();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("user") as string);
    setUserInfoState(userInfo);
  }, []);

  useEffect(() => {
    console.log(categoriesState, "currentItem");
    categoriesState && categoriesState?.includes(currentItem)
      ? null
      : setCategoriesState([...categoriesState, currentItem]);
  }, [currentItem]);

  useEffect(() => {
    setChosenCategoriesList(
      categoriesState?.map((category, i) => {
        if (category === "") return <div></div>;

        return <CategoriesComponent currentItem={category} key={i} />;
      })
    );
  }, [categoriesState]);

  useEffect(() => {
    console.log(categoriesState, "categories state");
  }, [categoriesState]);

  const FormValidEventSchema = EventSchema.omit({
    createdAt: true,
    userID: true,
    categories: true,
    availableSeats: true,
    eventId: true,
    imagePallete: true,
    creator: true,
  });

  const form = useForm<z.infer<typeof FormValidEventSchema>>({
    resolver: zodResolver(FormValidEventSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      province: "",
      mobile: "",
      imageFile: null,
      description: "",
      location: "",
      time: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    console.log(eventState, "event state");
    setAvailableSeatsState(
      eventState?.availableSeats as unknown as AvailableSeatsType[]
    );
    setEventIDState(eventState?.eventId as number);
    setCategoriesState(eventState?.categories as string[]);

    form.setValue("name", eventState?.name as string);
    form.setValue("startDate", eventState?.startDate as string);
    form.setValue("endDate", eventState?.endDate as string);
    form.setValue("province", eventState?.province as string);
    form.setValue("mobile", eventState?.mobile as string);
    form.setValue("description", eventState?.description as string);
    form.setValue("location", eventState?.location as string);
    form.setValue("time", eventState?.time as string);
    form.setValue("imageUrl", eventState?.imageUrl as string);
  }, [eventState]);

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
  //     creatorMailAdress: userInfoState,
  //     fallBackMailAdress: fallBackMailAdressState,
  //     userID: userIDAsString,
  //   };

  //   console.log(event);

  //   await sendUpdateRequest({ event }).catch((err) => console.log(err, "err"));
  // }

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

    const eventWithExtraParams: EventSchemaType = {
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

    if (imageFileState) {
      const palette = await generatePallete(imageFileState);
      event["imagePallete"] = palette;
      console.log(palette, "palette");
    }

    sendUpdateRequest({ event: eventWithExtraParams }).catch((err) =>
      console.log(err, "err")
    );
  };

  function onSubmittest() {
    console.log("onSubmit");
  }

  

  return (
    eventState && (
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
                <FormLabel>imageFile</FormLabel>
                <FormControl>
                  <Input
                    // className={inputStyling}
                    type="file"
                    accept="image/*"
                    max={"10000"}
                    placeholder="Selecet New Image"
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
          <Button type="submit" variant={"outline"} className="flex gap-4">
            Submit
            <Verified height="20px" width="20px" bgfill="#ED191D" />
          </Button>
        </form>
      </Form>
    )
  );
}
