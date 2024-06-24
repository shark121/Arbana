import { HTMLAttributes } from "react";

export default function Counter({
  max,
  id,
  defaultValue,
  setDefaultValue,
  ...props
}: {
  max: number;
  id: string;
  defaultValue: number;
  setDefaultValue: React.Dispatch<React.SetStateAction<number>>;
  props? : HTMLDivElement
}) {
  function changeDefaltValue(step: number) {
    setDefaultValue((defaultValue) => Number(defaultValue) + step || 1);

    if (defaultValue == 1 && step < 0) return;
  } 

  

  return (
    <div className="flex h-full  items-center  justify-center " {...props}>
      <div className="flex h-full w-full items-center justify-center">
        <button
          className=" p-4 text-[1.5rem] "
          onClick={() => changeDefaltValue(1)}
        >
          +
        </button>
        <div className="h-[2rem] w-[2rem] text-gray-700  rounded-full font-bold flex items-center justify-center">
          {defaultValue}
        </div>
        <button
          className=" p-4 text-[1.5rem] "
          onClick={() => changeDefaltValue(-1)}
        >
          -
        </button>
      </div>
    </div>
  );
}
