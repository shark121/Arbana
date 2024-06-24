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
      <div className="flex items-start space-x-2">
        <RadioGroupItem
          value={item.value}
          id={item.value}
          onSelect={(e) => console.log(e.currentTarget.value)}
        />
        <Label htmlFor={item.value}>{item.label}</Label>
      </div>
    );
  });

  return <RadioGroup defaultValue={data[0].label} onValueChange={(e)=>setValueState(e)}>{...list}</RadioGroup>;
}
