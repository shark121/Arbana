import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { COLORSMAP } from "../../data/colors";
import MenuSVG from "../../src/images/svg/menu";
import MenuComponent from "../ui/menuComponent";
import { menuItems } from "../ui/menuItems";

const list = menuItems.map(({ text, icon, url }, i) => (
  <SheetClose asChild key={i}>
    <MenuComponent text={text} icon={icon} url={url} />
  </SheetClose>
));

export default function SheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer flex flex-col gap-7">
          <MenuSVG width="30px" height="30px" fill={COLORSMAP.primaryBlue} />
        </div>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <div  className="hidden">
          <SheetTitle></SheetTitle>
        </div>
        <div className="flex flex-col w-full h-full gap-2">{list}</div>
      </SheetContent>
    </Sheet>
  );
}
