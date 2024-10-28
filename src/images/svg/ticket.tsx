import React from "react";

export default function TicketSVG({
  height,
  width,
  primaryColor,
  secondaryColor: secondaryColor,
  fill,
}: {
  height?: string;
  width?: string;
  fill?: string;
  primaryColor?: string;
  secondaryColor?: string;
}) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill ?? "none"}
    stroke="#000"
    strokeWidth="0"
    viewBox="0 0 24 24"
  >
    <path
      fill="#000"
      d="M19 18.75H5A1.76 1.76 0 013.25 17v-2.5a.76.76 0 01.75-.75 1.75 1.75 0 000-3.5.76.76 0 01-.75-.75V7A1.76 1.76 0 015 5.25h14A1.76 1.76 0 0120.75 7v2.5a.76.76 0 01-.75.75 1.75 1.75 0 000 3.5.76.76 0 01.75.75V17A1.76 1.76 0 0119 18.75zM4.75 15.16V17a.25.25 0 00.25.25h14a.25.25 0 00.25-.25v-1.84a3.25 3.25 0 010-6.32V7a.25.25 0 00-.25-.25H5a.25.25 0 00-.25.25v1.84a3.25 3.25 0 010 6.32z"
    ></path>
  </svg>
  );
}
