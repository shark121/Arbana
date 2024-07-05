"use cleint";
import React, { useState } from "react";
import { categoriesList } from "../../data/categories";

function Category({ category,setCurrentCategory, currentCategory }: { category: string, currentCategory:string, setCurrentCategory: React.Dispatch<React.SetStateAction<string>>}) {
  return <button className={`  m-2 rounded-[1rem] px-4 h-[2rem] ${category === currentCategory ? "bg-primary text-white": " ring-primary ring-gray-200 text-primary"} `}
  onClick={(e)=>setCurrentCategory(category)}
  >{category}</button>;
}

export default function Categories({
  //   categoriesList,
  currentCategory,
  setCurrentCategory,
}: {
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const list = categoriesList
    .map((category, i) => <Category key={i} category={category} setCurrentCategory={setCurrentCategory} currentCategory={currentCategory}/>);

  return (
    <div className="overscroll-x-contain overflow-x-scroll grid grid-flow-col mt-[1rem] bg-scroll h-[3rem] w-[20rem] [&::-webkit-scrollbar]:hidden ">
      {list}
    </div>
  );
}
