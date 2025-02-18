import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dotenv from "dotenv";
import Cookies from "js-cookie";
import {
  UserCredential,
  User,
  getAdditionalUserInfo,
  GoogleAuthProvider,
} from "firebase/auth";
import { database } from "@/firebase.config";
import { setDoc, doc, collection } from "firebase/firestore";
import { UserInfo, UserInfoWithToken, UserData } from "@/lib/types";
import { use } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setCookie(data: string, values: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${data}=${values}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name: string): Record<string, string> | null {
  if (Cookies.get(name) !== null) {
    try {
      return JSON.parse(Cookies.get(name) as string);
    } catch (error) {
      console.error(`Failed to parse cookie "${name}":`, error);
      return null;
    }
  }

  return null;
}

export function deleteCookie(name: string, path?: string, domain?: string) {
  if (getCookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

export function generateRandomId(length: number): string {
  const characters = "0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Example usage:
const randomId = generateRandomId(10); // Generates a random ID with 10 characters
console.log("Random ID:", randomId);

export function rgbToHex(r: number, g: number, b: number) {
  // Ensure the values are between 0 and 255
  r = Math.min(255, Math.max(0, Math.round(r)));
  g = Math.min(255, Math.max(0, Math.round(g)));
  b = Math.min(255, Math.max(0, Math.round(b)));

  // Convert to hex and pad with zeros if needed
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + "0".repeat(6 - hex.length) + hex;
}

// Example usage:
// const username = getCookie('username');
// if (username) {
//   console.log(`Welcome back, ${username}!`);
// } else {
//   console.log('No username cookie found.');
// }

// export function getColorPallete(i)

// const file = event.target.files[0];
// if (file) {
//     const objectURL = URL.createObjectURL(file);
//     setImagePreview(objectURL);

//     // Extract palette when image is loaded
//     const img = new Image();
//     img.src = objectURL;
//     img.crossOrigin = 'Anonymous'; // For CORS issues with external images

//     img.onload = async () => {
//         try {
//             const vibrantPalette = await Vibrant.from(img).getPalette();
//             const colors = Object.values(vibrantPalette).map(swatch => swatch?.getHex());
//             setPalette(colors);
//         } catch (error) {
//             console.error('Error extracting palette:', error);
//         } finally {
//             URL.revokeObjectURL(objectURL); // Clean up memory
//         }
//     };
// }

export async function getLocationCoordiantes(placeId: string) {
  console.log(placeId);
  return await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        console.log(data);
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    });
}

export function convertTo12HourFormat(time24: string) {
  const [hours, minutes] = time24.split(":");
  const period = +hours >= 12 ? "PM" : "AM";
  const hours12 = +hours % 12 || 12; // Convert 0 or 12 to 12 in 12-hour format
  return `${hours12}:${minutes} ${period}`;
}

export function convertTo24Hour(timeStr: string) {
  let [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function setClientCache({
  pathToServer,
  key,
  value,
}: {
  pathToServer: string | undefined;
  key: string;
  value: any;
}) {
  pathToServer &&
    fetch(pathToServer, {
      method: "POST",
      body: JSON.stringify({ key, value }),
    });
}

// export async function storeUserInfo(userCredential:  UserCredential, toast:any){
//   console.log("used pop up...........................");
//   const credential = GoogleAuthProvider.credentialFromResult(userCredential);
//   const token = await userCredential.user.getIdTokenResult();
//   console.log(token)

//   console.log(userCredential);

//   // The signed-in user info.
//   // const user = result.user;

//   const {
//     uid,
//     email,
//     emailVerified,
//     photoURL,
//     displayName,
//     phoneNumber,
//     providerData,
//   } = userCredential.user;

//   const user = {
//     uid,
//     email,
//     emailVerified,
//     photoURL,
//     displayName,
//     phoneNumber,
//     providerData,
//   };

//   const userInfo = { ...user, token };

//   Cookies.set("user", JSON.stringify(userInfo), {secure:true, sameSite:"strict", expires : new Date(token.expirationTime)});

//   const userInfoWithExtraFields = {
//     accountInfo: { name: displayName, uid, email, emailVerified: true },
//     events: [],
//     tickets: [],
//     followers: [],
//     following: [],
//   };

//    const additionalUserInfo = userCredential
//           ? getAdditionalUserInfo(userCredential)
//           : null;
//         if (additionalUserInfo && additionalUserInfo.isNewUser) {
//           setDoc(
//             doc(collection(database, "users"), userInfo.uid),
//             userInfoWithExtraFields,
//             { merge: true }
//           );

//   console.log(userInfo);
//   //   console.log(user);
//   toast({ description: "signed in successfully" });

//   setTimeout(()=>window.location.href="/",1000)

//   return user;
// }

// }

export async function storeUserInfo(user: User): Promise<UserInfo | null> {
  try {
    console.log("Signing in...");

    const token = await user.getIdTokenResult();
    console.log("Token received:", token);

    const {
      uid,
      email,
      emailVerified,
      photoURL,
      displayName,
      phoneNumber,
      providerData,
    } = user;
     
    
    const userInfo: UserInfoWithToken = {
      uid,
      email,
      emailVerified,
      photoURL,
      displayName,
      phoneNumber,
      providerData,
      token,
    };

    Cookies.set("user", JSON.stringify(userInfo), {
      secure: true,
      sameSite: "strict",
      expires: new Date(token.expirationTime),
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

    return userInfo;
  } catch (error) {
    console.error("Error during sign-in:", error);
    // toast({ description: "Sign-in failed. Please try again.", status: "error" });
    return null;
  }
}

export async function storeIfNewUser(userCredential: UserCredential) {
  const additionalUserInfo = getAdditionalUserInfo(userCredential);

  const userData: UserData = {
    accountInfo: {
      name: userCredential.user.displayName,
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
    },
    events: [],
    tickets: [],
    followers: [],
    following: [],
  };

  if (additionalUserInfo && additionalUserInfo.isNewUser) {
    await setDoc(
      doc(collection(database, "users"), userCredential.user.uid),
      userData,
      { merge: true }
    );
    console.log("New user data stored.");
  }

  // console.log("User signed in:", userInfo);
}
