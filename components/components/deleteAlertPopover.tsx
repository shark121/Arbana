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
        <Button variant="outline" className=" text-white font-bold">
        <DeleteIcon height="30px" width="30px" fill="red" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{heading}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              // variant=""
              className="bg-red-500 text-white font-bold w-full h-full"
              onClick={callback}
            >
              Delete
            </Button>
            {/* Continue */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
