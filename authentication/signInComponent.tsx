"use client";
import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase.config";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import GoogleAuth from "./googleAuth";
import { setCookie } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/images/svg/logo";
import Cookies from "js-cookie";
import PasswordInput from "../components/ui/passwordInputType";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignInComponent() {
  const [email, setEmail] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  async function emailAndPasswordSignIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        
        const token = await userCredential.user.getIdTokenResult();

        const {
          uid,
          email,
          emailVerified,
          photoURL,
          displayName,
          phoneNumber,
          providerData,
        } = userCredential.user;

        if (emailVerified === false) {
          toast({
            description: "Please verify your email before signing in",
            variant: "destructive",
          });

          throw new Error("Email not verified");
          
        }

        const user = {
          uid,
          email,
          emailVerified,
          photoURL,
          displayName,
          phoneNumber,
          providerData,
        };

        const userInfo = { ...user, token };
        Cookies.set("user", JSON.stringify(userInfo), {
          secure: true,
          sameSite: "strict",
          expires: new Date(token.expirationTime),
        });
        
        toast({ description: "Signed in successfully" });
        setTimeout(()=>window.location.href="/", 1000)

      }) 
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        toast({
          description: "Please verify your credentials and try again",
          variant: "destructive",
        });
      })
  }

  function handleOnclick() {
    console.log(email, passwordState)
    emailAndPasswordSignIn(email, passwordState);
  }

  return (
    <form
      className=" flex flex-col items-center justify-center text-black"
      onSubmit={(e) => {
        e.preventDefault();
        handleOnclick();
      }}
    >
      <div>
        <Logo />
      </div>
      <div className="w-[20rem]  flex flex-col items-center justify-center gap-4">
        <Input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(() => e.target.value)}
          className="text-black"
        />
        <PasswordInput
          passwordState={passwordState}
          setPasswordState={setPasswordState}
        />
        <button
          className="w-full h-14 bg-black/90 rounded-lg text-white"
          onClick={(e) => handleOnclick()}
          type="submit"
        >
          Submit
        </button>
        <div className=" w-full flex items-center justify-between  text-gray-400">
          <div className="w-[40%] h-[1px] outline-[5px] bg-black"></div>
          <div>or</div>
          <div className="w-[40%] h-[1px] outline-[5px] bg-black"></div>
        </div>
        <div>
          <GoogleAuth />
        </div>
      </div>
    </form>
  );
}
