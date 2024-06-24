import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import GoogleSVG from "../public/images/Google__G__logo.svg.png";
import { auth } from "../firebase.config";
import Image from "next/image";
import { set } from "firebase/database";
import { setCookie } from "@/lib/utils";

const provider = new GoogleAuthProvider();

async function triggerPopup() {
   return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential && credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setCookie("user", JSON.stringify(user), 7);
      window.location.href = "/";
    //   console.log(user);
      return user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

function handleOnClick() {
    triggerPopup().then((result) => {
        console.log(result);
    })
}

export default function GoogleAuth() {
  return (
      <button className="h-[2rem] w-[15rem] flex items-center justify-center gap-4 rounded-lg ring-2 relative my-3" onClick={handleOnClick}>
        Continue with google
        <Image src={GoogleSVG} height={20}  alt="google logo" />
      </button>
  );
}
