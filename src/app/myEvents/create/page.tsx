"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CalendarForm from "../../../../components/components/calendar";
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

type RequestType = EventType & { imageFile: File | null };

export type createRequestType = Omit<RequestType, "imageUrl">;

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

function AddTicket({
  setAvailableSeatsState,
}: {
  setAvailableSeatsState: React.Dispatch<React.SetStateAction<TicketType[]>>;
}) {
  const [ticketTier, setTicketTier] = useState<string>("");
  const [tierPrice, setTierPrice] = useState<number>(0);
  const [tierQuantity, setTierQuantity] = useState<number>(0);

  return (
    <div className="flex flex-col gap-4 w-full ">
      <Input
        placeholder="Ticket Tier"
        required={true}
        onChange={(e) => setTicketTier(e.target.value)}
      />
      <Input
        placeholder="Ticket Price"
        required={true}
        type="number"
        onChange={(e) => setTierPrice(Number(e.target.value))}
      />
      <Input
        placeholder="Ticket Quantity"
        required={true}
        type="number"
        onChange={(e) => setTierQuantity(Number(e.target.value))}
      />
      <Button
        onClick={(e) => {
          const allFieldsFilled = ticketTier && tierPrice && tierQuantity;

          allFieldsFilled &&
            setAvailableSeatsState((availableSeatsState) => [
              ...availableSeatsState,
              { tier: ticketTier, number: tierQuantity, price: tierPrice },
            ]);

          setTicketTier("");
          setTierPrice(0);
          setTierQuantity(0);
        }}
      >
        Add Ticket
      </Button>
    </div>
  );
}

export default function CreateEvent() {
  const [eventNameState, setEventNameState] = useState("");
  const [startDateState, setStartDateState] = useState<string>("");
  const [endDateState, setEndDateState] = useState<string>("");
  const [startTimeState, setStartTimeState] = useState<string>("00:00");
  const [locationState, setLocationState] = useState<string>("");
  const [descriptionState, setDescriptionState] = useState("");
  const [availableSeatsState, setAvailableSeatsState] = useState<TicketType[]>(
    []
  );
  const [currentItem, setCurrentItem] = useState<string>("");
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

  async function handleCreateEvent() {
    const fileteredCategories = categoriesState.filter(
      (category) => category !== ""
    );

    console.log(fileteredCategories);

    const event: Omit<RequestType, "imageUrl"> = {
      name: eventNameState,
      startDate: startDateState,
      endDate: endDateState,
      location: locationState,
      description: descriptionState,
      categories: fileteredCategories,
      availableSeats: availableSeatsState,
      eventId: eventIDState,
      time: startTimeState,
      imageFile: imageFileState,
      createdAt: new Date().toISOString(),
      creatorMailAdress: userInfoState?.email,
      fallBackMailAdress: fallBackMailAdressState,
    };

    console.log(event);
    await sendCreateRequest({ event });
  }

  return (
    <div className="w-full min-h-full flex items-center justify-center gap-2 flex-col px-2">
      <div className="font-bold text-[1.2rem]">Create Event</div>
      <Input
        placeholder="Event Name"
        onChange={(e) => setEventNameState(e.target.value)}
      />
      <Input
        placeholder="Event Start Time"
        type="time"
        onChange={(e) => setStartTimeState(e.target.value)}
      />
      <Input
        placeholder="Event Location"
        onChange={(e) => setLocationState(e.target.value)}
      />
      <Textarea
        placeholder="Event Description"
        onChange={(e) => setDescriptionState(e.target.value)}
      />
      <Input
        type="string"
        placeholder="YYYY-MM-DD"
        onChange={(e) => setStartDateState(e.target.value)}
      />
      <Input
        type="string"
        placeholder="YYYY-MM-DD"
        onChange={(e) => setEndDateState(e.target.value)}
      />
      <Selector
        label="Genre"
        items={categoriesList}
        setCurrentItemState={setCurrentItem}
      />
      <Input
        type="file"
        accept="image/*"
        max={"1000"}
        placeholder="Image URL"
        onChange={(e) =>
          e.target.files &&
          setImageFileState(e.target.files?.[0] as unknown as File)
        }
      />
      <Input
        placeholder="Fallback Mail Adress"
        onChange={(e) => setFallBackMailAdressState(e.target.value)}
      />
      <div className="w-full ">{chosenCategoriesList}</div>
      <div>{<AddTicket setAvailableSeatsState={setAvailableSeatsState} />}</div>
      <Button onClick={async () => await handleCreateEvent()}>
        Create Event
      </Button>
    </div>
  );
}
