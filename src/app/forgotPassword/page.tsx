"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useState } from "react";
import Logo from "@/images/svg/logo";
import { useToast } from "@/hooks/use-toast";

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

export default function forgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  async function handleOnClick(email: string) {
    console.log(email);
    await SendPasswordReset(email)
      .then(() => {
        toast({description: "Reset email sent"});
        setEmailSent(true);
        console.log("email sent");
        window.location.href = "/home";
      })
      .catch((error) => {
        toast({
          description: "There was an error sending reset email",
          variant: "destructive",
        });
        console.log(error);
      });
  }


  return (
    <form className="h-screen w-screen flex flex-col justify-center items-center gap-4"
    onSubmit={(e) => {
      e.preventDefault();
      handleOnClick(email);
    }}
    >
      <Logo />
      {/* <div>Logo</div> */}
      <div className="text-center">
        <h1 className="text-2xl">Forgot Password ?</h1>
        <p className="text-[0.8rem]">Enter your email to reset your password</p>
      </div>
      <div className="w-[20rem] flex items-center flex-col">
        <Input
          type="email"
          placeholder="example@gmail.com"
          onChange={(e) => setEmail((email) => e.target.value)}
        />
        <Button className="my-4" 
        type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
