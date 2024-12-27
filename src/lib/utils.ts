import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {createClient} from "redis";
import dotenv from "dotenv";



export const vars = dotenv.config({path: "../.env"});  




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setCookie(data: string, values: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${data}=${values}; expires=${expires.toUTCString()}; path=/`;
}

// Example usage:
// setCookie('username', 'john_doe', 7); // Sets a cookie named 'username' with value 'john_doe' that expires in 7 days

export function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  console.log(cookies);

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      // JSON.parse(cookieValue)
      return decodeURIComponent(cookieValue);
      // return cookieValue;
    }
  }

  return null; // Cookie not found
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


export function rgbToHex(r:number, g:number, b:number) {
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


