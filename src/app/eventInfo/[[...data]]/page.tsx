"use client";

import { collection, getDoc, doc } from "firebase/firestore";
import { database } from "@/firebase.config";
import ScanQRCode from "../../scan/[[...data]]/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TicketType } from "../../../../components/ui/eventComponent";
import { generateRandomId } from "../../../lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Selector } from "../../../../components/components/selector";
import { categoriesList } from "../../../../data/categories";
import { X } from "lucide-react";
import z from "zod";
import { Form } from "react-hook-form";
import { EventType } from "../../../../components/ui/eventComponent";
import { User } from "firebase/auth";
import TicketPopOver from "../../../../components/components/ticketPopOver";
import TicketTierType, {
  AddNewTicket,
} from "../../../../components/components/eventInfo/ticketTierTypeComponent";

async function sendCreateRequest({ event }: { event: createRequestType }) {
  const { imageFile, ...rest } = event;
  const requestFormData = new FormData();
  imageFile && requestFormData.append("imageFile", imageFile);
  requestFormData.append("rest", JSON.stringify(rest));

  await fetch("/api/data/create/event/", {
    method: "POST",
    body: requestFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

type RequestType = EventType & { imageFile: File | null };

export type createRequestType = Omit<RequestType, "imageUrl">;

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
  const [eventState, setEventState] = useState<EventType>();

  useEffect(() => {
    getDoc(doc(collection(database, "events"), params.params.data[0])).then(
      (doc) => {
        console.log(doc.data());
        setEventState(doc.data() as EventType);
      }
    );
  }, []);

  const [eventNameState, setEventNameState] = useState<string>("");
  const [startDateState, setStartDateState] = useState<string>("");
  const [endDateState, setEndDateState] = useState<string>("");
  const [startTimeState, setStartTimeState] = useState<string>("00:00");
  const [locationState, setLocationState] = useState<string>("");
  const [descriptionState, setDescriptionState] = useState("");
  const [availableSeatsState, setAvailableSeatsState] = useState<TicketType[]>(
    []
  );
  const [currentItem, setCurrentItem] = useState<string>("");
  const [seatsState, setSeatsState] = useState<TicketType[]>([]);
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [chosenCategoriesList, setChosenCategoriesList] =
    useState<JSX.Element[]>();
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  const [createdEvent, setCreateEvent] = useState<EventType>();
  const [eventIDState, setEventIDState] = useState<number>(
    Number(generateRandomId(20))
  );
  const [userInfoState, setUserInfoState] = useState<User>();
  const [fallBackMailAdressState, setFallBackMailAdressState] =
    useState<string>("");

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

  useEffect(() => {
    console.log(eventState, "event state");
    setEventNameState(eventState?.name as string);
    setStartDateState(eventState?.startDate as string);
    setEndDateState(eventState?.endDate as string);
    setStartTimeState(eventState?.time as string);
    setLocationState(eventState?.location as string);
    setDescriptionState(eventState?.description as string);
    setAvailableSeatsState(eventState?.availableSeats as TicketType[]);
    setEventIDState(eventState?.eventId as number);
    setFallBackMailAdressState(eventState?.fallBackMailAdress as string);
    setCategoriesState(eventState?.categories as string[]);
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

  async function handleCreateEvent() {
    const fileteredCategories = categoriesState.filter(
      (category) => category !== ""
    );

    const userIDAsString = userInfoState?.uid as string;

    console.log(userIDAsString, "user ID");

    console.log(fileteredCategories);

    const event: Omit<RequestType, "imageUrl"> = {
      name: eventNameState,
      startDate: startDateState,
      endDate: endDateState,
      location: locationState,
      description: descriptionState,
      categories: fileteredCategories,
      availableSeats: seatsState,
      eventId: eventIDState,
      time: startTimeState,
      imageFile: imageFileState,
      createdAt: new Date().toISOString(),
      creatorMailAdress: userInfoState?.email,
      fallBackMailAdress: fallBackMailAdressState,
      userID: userIDAsString,
    };

    console.log(event);

    await sendCreateRequest({ event }).catch((err) => console.log(err, "err"));
  }

  return (
    <div className="w-full min-h-full flex items-center justify-center gap-2 flex-col px-2">
      <div className="font-bold text-[1.2rem]">Edit Event</div>
      <Input
        placeholder="Event Name"
        onChange={(e) => setEventNameState(e.target.value)}
        defaultValue={eventState?.name}
      />
      <Input
        placeholder="Event Start Time"
        type="time"
        onChange={(e) => setStartTimeState(e.target.value)}
        defaultValue={eventState?.time}
      />
      <Input
        placeholder="Event Location"
        onChange={(e) => setLocationState(e.target.value)}
        defaultValue={eventState?.location}
      />
      <Textarea
        placeholder="Event Description"
        onChange={(e) => setDescriptionState(e.target.value)}
        defaultValue={eventState?.description}
      />
      <Input
        type="string"
        placeholder="YYYY-MM-DD"
        onChange={(e) => setStartDateState(e.target.value)}
        defaultValue={eventState?.startDate}
      />
      <Input
        type="string"
        placeholder="YYYY-MM-DD"
        onChange={(e) => setEndDateState(e.target.value)}
        defaultValue={eventState?.endDate}
      />

      <Input
        type="file"
        accept="image/*"
        max={"1000"}
        placeholder="Image URL"
        onChange={(e) => {
          console.log(e.target.files);
          e.target.files &&
            setImageFileState(e.target.files?.[0] as unknown as File);
        }}
        defaultValue={eventState?.imageUrl}
      />
      <Input
        placeholder="Fallback Mail Adress"
        onChange={(e) => setFallBackMailAdressState(e.target.value)}
        defaultValue={eventState?.fallBackMailAdress}
      />
      <Selector
        label="Genre"
        items={categoriesList}
        setCurrentItemState={setCurrentItem}
      />
      <div className="w-full ">{chosenCategoriesList}</div>
      <div>
        {
          <AddTicket
            setAvailableSeatsState={setAvailableSeatsState}
            availableSeatsState={availableSeatsState}
            seatsState={seatsState}
            setSeatsState={setSeatsState}
          />
        }
      </div>
      <Button onClick={async () => await handleCreateEvent()}>
        Update Event
      </Button>
    </div>
  );
}
