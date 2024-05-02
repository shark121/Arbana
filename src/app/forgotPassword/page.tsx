"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useState } from "react";

async function SendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("email sent");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ..
    });
}

async function handleOnClick(email: string) {
  console.log(email)
 await SendPasswordReset(email);
}

export default function forgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
      <div>Logo</div>
      <div className="w-[20rem] flex items-center flex-col">
        <Input type="email" placeholder="@email" onChange={(e)=>setEmail(email=>e.target.value)} />
        <Button className="my-4" onClick={async ()=>handleOnClick(email)}>
          Submit
        </Button>
      </div>
    </div>
  );
}
