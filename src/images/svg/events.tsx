import React from "react";

export default function EventsComponent({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      <g>
        <path
          d="M16.17 25.86l-5.36-5.36a1 1 0 011.41-1.41L16.17 23l8.64-8.64a1 1 0 011.41 1.41z"
          className="clr-i-outline clr-i-outline-path-1"
        ></path>
        <path
          d="M32.25 6H29v2h3v22H4V8h3V6H3.75A1.78 1.78 0 002 7.81v22.38A1.78 1.78 0 003.75 32h28.5A1.78 1.78 0 0034 30.19V7.81A1.78 1.78 0 0032.25 6z"
          className="clr-i-outline clr-i-outline-path-2"
        ></path>
        <path
          d="M10 10a1 1 0 001-1V3a1 1 0 00-2 0v6a1 1 0 001 1z"
          className="clr-i-outline clr-i-outline-path-3"
        ></path>
        <path
          d="M26 10a1 1 0 001-1V3a1 1 0 00-2 0v6a1 1 0 001 1z"
          className="clr-i-outline clr-i-outline-path-4"
        ></path>
        <path
          d="M13 6H23V8H13z"
          className="clr-i-outline clr-i-outline-path-5"
        ></path>
        <path fillOpacity="0" d="M0 0H36V36H0z"></path>
      </g>
    </svg>
  );
}
