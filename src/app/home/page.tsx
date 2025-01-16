"use client";
import { useState, useRef, useEffect } from "react";
import SignInComponent from "../../../authentication/signInComponent";
import SignUpComponent from "../../../authentication/signUpComponent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const [hasAccount, setHasAccount] = useState(true);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const descriptionsMap: Record<string, string> = {
    "/account": "Sign in to access your account",
    "/tickets": "Sign in to access your tickets",
    "/myEvents": "Sign in to access your events",
  };

  const path: string = searchParams.get("path") || "";

  useEffect(() => {
    if (path) {
      console.log(path);
      toast({
        title: "Sign In required",
        description: descriptionsMap[path],

        // action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    }
  }, []);

  // return <div></div>

  return (
    <div className="flex flex-col items-center justify-center m-0 p-0 h-[100vh] w-[100wv] overflow-hidden ">
      {hasAccount ? <SignInComponent /> : <SignUpComponent />}
      <div className="text-[0.8rem] flex w-[15rem] cursor-pointer">
        {hasAccount ? (
          <div className="w-full flex justify-between">
            <div onClick={() => setHasAccount(false)}>New here? Sign up</div>
            <Link
              className="text-blue-300"
              href={"/forgotPassword?verified=false"}
            >
              Forgot password?
            </Link>
          </div>
        ) : (
          <div onClick={() => setHasAccount(!hasAccount)} className="">
            Already have an account? sign in
          </div>
        )}
      </div>
    </div>
  );
}
