import React from "react";

export default function BackSVG({
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
      fill={fill ?? "#000000"}
      version="1.1"
      viewBox="0 0 486.975 486.975"
      xmlSpace="preserve"
    >
      <path d="M473.475 230.025h-427.4l116-116c5.3-5.3 5.3-13.8 0-19.1-5.3-5.3-13.8-5.3-19.1 0l-139 139c-5.3 5.3-5.3 13.8 0 19.1l139 139c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.3-5.3 5.3-13.8 0-19.1l-116-116h427.5c7.5 0 13.5-6 13.5-13.5s-6-13.4-13.5-13.4z"></path>
    </svg>
  );
}
