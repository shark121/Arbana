import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "redis";
import dotenv from "dotenv";
import Cookies from "js-cookie";

export const vars = dotenv.config({ path: "../.env" });

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

// export function getCookie(name: string): object | null {
//   const cookieString = document.cookie;
//   const cookies = cookieString.split("; ");

//   for (const cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.split("=");
//     if (cookieName === name) {
//       try {
//         return JSON.parse(decodeURIComponent(cookieValue));
//       } catch (error) {
//         console.error(`Failed to parse cookie "${name}":`, error);
//         return null;
//       }
//     }
//   }

//   return null; 
// }


export function getCookie(name: string): Record<string, string> | null {
  if(Cookies.get(name) !== null){
  
    try{
      return JSON.parse(Cookies.get(name) as string); 
    }catch(error){
      console.error(`Failed to parse cookie "${name}":`, error);
      return null;
  }

}

return null

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


<<<<<<< HEAD
export function convertTo24Hour(timeStr:string) {
  let [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === "AM") {
      if (hours === 12) {
          hours = 0;
      }
  } else {
      if (hours !== 12) {
          hours += 12;
      }
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


=======
>>>>>>> feature/maps
