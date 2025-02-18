"use client";
import { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  
} from "firebase/auth";
import { auth, database } from "../src/firebase.config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/utils";
import PasswordInput from "../components/ui/passwordInputType";
import { setDoc, doc, collection } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import Logo from "@/images/svg/logo";

async function createNewUserWithEmailAndPassword(
  email: string,
  password: string
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      sendEmailVerification(userCredential.user)
        .then(() => {
          console.log("Email verification sent");
          toast({
            description: "Email verification sent",
            variant: "default",
          });

          window.location.href = "/home";
        })
        .catch((error) => {
          console.error(error.code);
        })
    })
    .catch((error) => {
      console.error(error.code);
      console.log(error);
      console.error(error.message);
      if (error.code.includes("email-already-in-use")) {
        toast({
          description: "Email already in use",
          variant: "destructive",
        });
      }else{

        toast({
          description: "An error occured",
          variant: "destructive",
        });
      }
      // ..
    });
}

export default function SignUpComponent() {
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");

  async function handleOnclick() {
    if (passwordState !== confirmPasswordState) {
      toast({ description: "Passwords do not match", variant: "destructive" });
      return;
    }
    await createNewUserWithEmailAndPassword(emailState, passwordState);
  }

  return (
    <form
      className="w-screen  flex flex-col items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleOnclick();
      }}
    >
      <Logo />
      <div className="w-[20rem]  flex flex-col items-center justify-center gap-4">
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmailState(() => e.target.value)}
        />
        <PasswordInput
          passwordState={passwordState}
          setPasswordState={setPasswordState}
        />

        <PasswordInput
          passwordState={confirmPasswordState}
          setPasswordState={setConfirmPasswordState}
        />
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
