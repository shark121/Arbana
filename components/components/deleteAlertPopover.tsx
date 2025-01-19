import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@/images/svg/delete";

export default function AlertDialogComp({
  displayText,
  heading,
  description,
  callback,
}: {
  displayText: string;
  heading: string;
  description: string;
  callback: () => void;
}) {
  console.log("clicked");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className=" text-white font-bold h-[40px] w-[40px] flex items-center justify-center">
        <DeleteIcon height="30px" width="30px" fill="red" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{heading}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <div
              // variant=""
              className="#bg-red-500 text-white font-bold w-full h-full cursor-pointer"
              onClick={callback}
            >
              Delete
            </div>
            {/* Continue */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
