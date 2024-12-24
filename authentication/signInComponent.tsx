"use client";
import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase.config";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import GoogleAuth from "./googleAuth";
import { setCookie } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/images/svg/logo"

export async function emailAndPasswordSignIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      setCookie("user", JSON.stringify(user), 7);
      sessionStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // window.alert("there was an error signing in ");
    });
}

export default function SignInComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleOnclick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    emailAndPasswordSignIn(email, password);

    emailRef?.current?.value ? (emailRef.current.value = "") : null;
    passwordRef?.current?.value ? (passwordRef.current.value = "") : null;

    setEmail("");
    setPassword("");
  }

  return (
    <main className=" flex flex-col items-center justify-center text-black">
      <div>
        <Logo/>
      </div>
      <div className="w-[20rem]  flex flex-col items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="email"
          ref={emailRef}
          onChange={(e) => setEmail(() => e.target.value)}
          className="text-black"
        />
        <Input
          type="password"
          placeholder="password"
          ref={passwordRef}
          onChange={(e) => setPassword(() => e.target.value)}
          className="text-black"
        />
        <button
          className="w-full h-14 bg-black/90 rounded-lg text-white"
          onClick={(e) => handleOnclick(e)}
        >
          Submit
        </button>
        <div className=" w-full flex items-center justify-between  text-gray-400">
          <div className="w-[40%] h-[1px] outline-[5px] bg-black"></div>
          <div>or</div>
          <div className="w-[40%] h-[1px] outline-[5px] bg-black"></div>

          {/* <div className="w-[40%] h-10 outline-[5px] bg-black"></div> */}
        </div>
        <div>
          <GoogleAuth />
        </div>
      </div>
    </main>
  );
}
