import React from "react";

export default function MenuSVg({
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
      width={width ?? "800"}
      height={height ?? "800"}
      fill={backgroundColor ?? "#000000"}
      viewBox="0 0 24 24"
    >
      <path
        stroke={fill ?? "#000000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 5a1 1 0 10-2 0 1 1 0 002 0zM13 12a1 1 0 10-2 0 1 1 0 002 0zM13 19a1 1 0 10-2 0 1 1 0 002 0z"
      ></path>
    </svg>
  );
}
