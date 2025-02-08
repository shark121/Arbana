import { Input } from "@/components/ui/input";
import { ref } from "firebase/storage";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LegacyRef } from "react";

export default function PasswordInput({
  setPasswordState,
  passwordState,
}: {
  setPasswordState: React.Dispatch<React.SetStateAction<string>>;
  passwordState: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>();

  return (
    
    <div className="flex h-14 bg-gray-100 rounded-lg w-full">
      <Input
        type={isOpen ? "text" : "password"}
        onChange={(e) => setPasswordState(e.target.value)}
        className="outline-none"
        placeholder="password"
      />
      <div className="h-14 aspect-square flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <Eye /> : <EyeOff />}
      </div>
    </div>
  );
}
