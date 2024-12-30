import { EventSchemaType as EventType} from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { COLORSMAP } from "../../../data/colors";

function handleEventOnclick(event: EventType) {
  sessionStorage.setItem(String(event.eventId), JSON.stringify(event));
  window.location.href = `/myEvents/eventOptions/${event.eventId}`;
}

export default function EventListComponent({
  userEvent,
}: {
  userEvent: EventType;
}): JSX.Element {
  return (
    <div
      className="w-full h-[2.5rem] hover:bg-gray-200  border-b-[1px] border-gray-100 text-gray-700 text-[0.85rem] flex items-center cursor-pointer justify-between"
      key={userEvent.eventId}
      onClick={() => handleEventOnclick(userEvent)}
    >
      <div>{userEvent.name}</div>
      <ChevronRight size={20} color={"red"} />
    </div>
  );
}
