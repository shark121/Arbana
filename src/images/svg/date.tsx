import React from "react";

export default function DateSVG({
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
    width={width ?? "100%"}
    height={height ?? "100%"}
    fill={backgroundColor ?? "none"}
    viewBox="0 0 24 24"
  >
    <path
      stroke={fill ?? "#000"}
      strokeLinecap="round"
      strokeWidth="2"
      d="M20 10V7a2 2 0 00-2-2H6a2 2 0 00-2 2v3m16 0v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9m16 0H4m4-7v4m8-4v4"
    ></path>
    <rect width="3" height="3" x="6" y="12" fill={fill ?? "#000"} rx="0.5"></rect>
    <rect width="3" height="3" x="10.5" y="12" fill={fill ?? "#000"} rx="0.5"></rect>
    <rect width="3" height="3" x="15" y="12" fill={fill ?? "#000"} rx="0.5"></rect>
  </svg>

  );
}
