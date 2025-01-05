import {Button} from "@/components/ui/button"
import {X} from "lucide-react"


export function CategoriesComponent({ currentItem, categoriesState, setCategoriesState }: { currentItem: string, categoriesState: string[], setCategoriesState: React.Dispatch<React.SetStateAction<string[]>> }) {
    function handleOnClick() {
      const newCategories = categoriesState?.filter(
        (category) => category !== currentItem
      );
      setCategoriesState(newCategories);
    }

    return (
      <Button variant={"outline"} className="m-4">
        {currentItem}{" "}
        <X
          onClick={handleOnClick}
          height={"15px"}
          width={"15px"}
          className="mx-3"
        />
      </Button>
    );
  }