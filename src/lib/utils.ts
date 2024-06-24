import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function setCookie(data:string, values:string, days:number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${data}=${values}; expires=${expires.toUTCString()}; path=/`;
}

// Example usage:
// setCookie('username', 'john_doe', 7); // Sets a cookie named 'username' with value 'john_doe' that expires in 7 days



export function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null; // Cookie not found
}


export function generateRandomId(length: number): string {
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Example usage:
const randomId = generateRandomId(10); // Generates a random ID with 10 characters
console.log('Random ID:', randomId);




// Example usage:
// const username = getCookie('username');
// if (username) {
//   console.log(`Welcome back, ${username}!`);
// } else {
//   console.log('No username cookie found.');
// }
