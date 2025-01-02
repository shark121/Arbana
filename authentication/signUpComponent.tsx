"use client";
import { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../src/firebase.config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/utils";
import Logo from "@/images/svg/logo";

async function createNewUserWithEmailAndPassword(
  email: string,
  password: string
) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const { uid, email, emailVerified, displayName, phoneNumber, photoURL } =
        userCredential.user;
      const userInfo = {
        uid,
        email,
        emailVerified,
        displayName,
        phoneNumber,
        photoURL,
      };
      setCookie("user", JSON.stringify(userInfo), 1);
      sessionStorage.setItem("user", JSON.stringify(userInfo));
      console.log(userInfo);

      await sendEmailVerification(user).then((verification) => {
        
        console.log(verification);
        console.log("email sent");
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
    
    });
}

export default function SignUpComponent() {
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  function handleOnclick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    createNewUserWithEmailAndPassword(emailState, passwordState);

    emailRef?.current?.value ? (emailRef.current.value = "") : null;
    passwordRef?.current?.value ? (passwordRef.current.value = "") : null;
    confirmPasswordRef?.current?.value
      ? (confirmPasswordRef.current.value = "")
      : null;

    setEmailState("");
    setPasswordState("");
  }

  return (
    <main className="w-screen  flex flex-col items-center justify-center">
      {/* <div>Logo</div> */}
      <Logo />
      <div className="w-[20rem]  flex flex-col items-center justify-center gap-4">
        <Input
          type="email"
          placeholder="Email"
          ref={emailRef}
          onChange={(e) => setEmailState(() => e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          onChange={(e) => setPasswordState(() => e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          ref={confirmPasswordRef}
          onChange={(e) => setPasswordState(() => e.target.value)}
        />
        <Button onClick={(e) => handleOnclick(e)}>Submit</Button>
      </div>
    </main>
  );
}
