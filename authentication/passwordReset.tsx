import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  function handleOnclick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

    emailRef?.current?.value ? (emailRef.current.value = "") : null;

    setEmail("");
  }

  return (
    <main className=" flex flex-col items-center justify-center">
      <div>Logo</div>
      <div className="w-[20rem]  flex flex-col items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="email"
          ref={emailRef}
          onChange={(e) => setEmail(() => e.target.value)}
        />
        <Button onClick={(e) => handleOnclick(e)}>Submit</Button>
      </div>
    </main>
  );
}
