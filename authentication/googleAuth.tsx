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

const provider = new GoogleAuthProvider();

async function triggerPopup() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.

      console.log("used pop up...........................");
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential && credential.accessToken;

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

      const userInfo = {
        uid,
        email,
        emailVerified,
        displayName,
        phoneNumber,
        photoURL,
      };
      setCookie("user", JSON.stringify(user), 1);
      sessionStorage.setItem("user", JSON.stringify(user));
      // window.location.href = "/";

      const userInfoWithExtraFields = {
        accountInfo: { name: displayName, uid, email, emailVerified: true },
        events: [],
        tickets: [],
        followers: [],
        following: [],
      };

      const additionalUserInfo = result ? getAdditionalUserInfo(result) : null;
      if (result && additionalUserInfo && additionalUserInfo.isNewUser) {
        setDoc(
          doc(collection(database, "users"), userInfo.uid),
          userInfoWithExtraFields ,
          { merge: true }
        );
        
        sessionStorage.setItem("user", JSON.stringify(userInfoWithExtraFields));
      }

     
      console.log(userInfo);
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
  });
}

export default function GoogleAuth() {
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
