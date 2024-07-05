import React from "react";

export default function HomeSVG({
  height,
  width,
  fill,
  backgroundColor,
}: {
  height?: string;
  width?: string;
  fill?: string;
  backgroundColor?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="svg-icon"
      style={{ width: width ?? "100%", height:height ?? "100%", verticalAlign: "middle" }}
      fill="currentColor"
      overflow="hidden"
      viewBox="0 0 1024 1024"
    >
      <path fill="#E8EAF6" d="M896 832H128V490.667L512 128l384 362.667z"></path>
      <path
        fill="#C5CAE9"
        d="M832 448L725.333 341.333V192H832zM128 832h768v106.667H128z"
      ></path>
      <path
        fill="#B71C1C"
        d="M512 91.733l-426.667 396.8L128 535.467 512 179.2l384 356.267 42.667-46.934z"
      ></path>
      <path fill="#D84315" d="M384 597.333h256v341.334H384z"></path>
      <path fill="#01579B" d="M448 362.667h128v128H448z"></path>
      <path
        fill="#FF8A65"
        d="M586.667 757.333c-6.4 0-10.667 4.267-10.667 10.667v42.667c0 6.4 4.267 10.666 10.667 10.666s10.666-4.266 10.666-10.666V768c0-6.4-4.266-10.667-10.666-10.667z"
      ></path>
    </svg>
  );
}
