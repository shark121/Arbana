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
    width={width ?? "100%"}
    height={height ?? "100%"}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke={fill ?? "red"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M7 12h10m-8 6h6"
    ></path>
  </svg>
  );
}
