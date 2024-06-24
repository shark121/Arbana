import React from "react";

export default function UserSVG({
  height,
  width,
  fill,
}: {
  height?: string;
  width?: string;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "100%"}
      height={height ?? "100%"}
      fill={"none"}
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="9"
        r="3"
        stroke={fill ?? "#1C274C"}
        strokeWidth="1.5"
        opacity="0.5"
      ></circle>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={fill ?? "#1C274C"}
        strokeWidth="1.5"
      ></circle>
      <path
        stroke={fill ?? "#1C274C"}
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
        opacity="0.5"
      ></path>
    </svg>
  );
}
