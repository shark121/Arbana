import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { List } from "lucide-react";
import React from "react";

export default function RadioGroupComponent({
  data,
  valueState,
  setValueState,
}: {
  valueState: string;
  setValueState: React.Dispatch<React.SetStateAction<string>>;
  data: { label: string; value: string }[];
}) {
  const list = data.map((item) => {
    return (
      <Label htmlFor={item.value}>
        <div className="flex items-center justify-start p-4 space-x-2 h-[5rem]  m-2 rounded-xl shadow-sm ">
          <RadioGroupItem
            value={item.value}
            id={item.value}
            onSelect={(e) => console.log(e.currentTarget.value)}
          />
          <div className="m-2">{item.label}</div>
        </div>
      </Label>
    );
  });

  return (
    <RadioGroup
      defaultValue={data[0].label}
      onValueChange={(e) => setValueState(e)}
      className="w-[95%] rounded-xl "
    >
      {...list}
    </RadioGroup>
  );
}
