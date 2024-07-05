import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Selector({
  label,
  items,
  setCurrentItemState,
}: {
  label: string;
  items: string[];
  setCurrentItemState: React.Dispatch<React.SetStateAction<string>>
}) {
  const list = items.map((item, index) => {
    return (
      <SelectItem key={index} value={item}>
        {item}
      </SelectItem>
    );
  });

  return (
    <Select onValueChange={(e) => setCurrentItemState(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select a ${label} `}  />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {list}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
