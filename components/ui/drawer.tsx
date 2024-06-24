import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { FilterButton } from "./searchBar";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FileterSVG from "@/images/svg/filter";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export function DrawerComponent({
  contentData,
}: {
  contentData: JSX.Element[];
}) {
  const [goal, setGoal] = React.useState(350);

  const contentList = contentData.map((content, i) => (
    <DrawerClose key={i} asChild>
      {content}
    </DrawerClose>
  ));

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button>
          <FilterButton />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              <div className="w-full flex items-center justify-center">
                Filter By
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="mt-3 h-[10px] pb-4">{contentList}</div>
          </div>
          <DrawerFooter>
            {/* <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
