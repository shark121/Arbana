import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import GoogleSVG from "../public/images/Google__G__logo.svg.png";
import { auth } from "../src/firebase.config";
import Image from "next/image";
import { setCookie } from "@/lib/utils";
import { setDoc, doc, collection } from "firebase/firestore";
import { database } from "@/firebase.config";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useUserContext } from "@/contexts/userContext";
import {User} from "firebase/auth";
import { set } from "date-fns";

export default function GoogleAuth() {
  const { toast } = useToast();
  const { setUser } = useUserContext();

  const provider = new GoogleAuthProvider();

  async function triggerPopup() {

    return signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.

        console.log("used pop up...........................");
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential && credential.accessToken;
        const token = await result.user.getIdTokenResult();
        console.log(token)

        setUser(result.user);

        console.log(result);

        // The signed-in user info.
        // const user = result.user;

        const {
          uid,
          email,
          emailVerified,
          photoURL,
          displayName,
          phoneNumber,
          providerData,
        } = result.user;

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


        Cookies.set("user", JSON.stringify(userInfo), {secure:true, sameSite:"strict", expires : new Date(token.expirationTime)});

    
        const userInfoWithExtraFields = {
          accountInfo: { name: displayName, uid, email, emailVerified: true },
          events: [],
          tickets: [],
          followers: [],
          following: [],
        };

        const additionalUserInfo = result
          ? getAdditionalUserInfo(result)
          : null;
        if (result && additionalUserInfo && additionalUserInfo.isNewUser) {
          setDoc(
            doc(collection(database, "users"), userInfo.uid),
            userInfoWithExtraFields,
            { merge: true }
          );

          sessionStorage.setItem(
            "user",
            JSON.stringify(userInfoWithExtraFields)
          );
        }

        console.log(userInfo);
        //   console.log(user);
        toast({ description: "signed in successfully" });

        setTimeout(()=>window.location.href="/",1000)

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

        toast({
          description: error.message,
          variant: "destructive",
        });
        // ...
      });
  }

  function handleOnClick() {
    triggerPopup()
      .then((result) => {
        console.log(result);
      })
  }

  return (
    <button
      className="h-10 w-[15rem] flex items-center justify-center gap-4 rounded relative my-3 bg-gray-100"
      onClick={handleOnClick}
    >
      Continue with google
      <Image src={GoogleSVG} height={20} alt="google logo" />
    </button>
  );
}
