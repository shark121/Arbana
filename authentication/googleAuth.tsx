import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import GoogleSVG from "../public/images/Google__G__logo.svg.png";
import { auth } from "../src/firebase.config";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/contexts/userContext";
import { storeIfNewUser } from "@/lib/utils";

export default function GoogleAuth() {
  const { toast } = useToast();
  const { setUser } = useUserContext();

  const provider = new GoogleAuthProvider();

  async function triggerPopup() {
    return signInWithPopup(auth, provider)
      .then(async (result) => {

        await storeIfNewUser(result).catch((e) => {
          toast({ description: e.message, variant: "destructive" });
        })
        

        toast({ description: "Signed in successfully" });
        
        window.location.href = "/";

     
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
    triggerPopup().then((result) => {
      console.log(result);
    });
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
