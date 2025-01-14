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



export const ColoredTicket = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Capa_1"
    fill="#000"
    version="1.1"
    viewBox="0 0 370 370"
    height={"100%"}
    width={"100%"}
  >
    <g id="SVGRepo_iconCarrier">
      <g id="XMLID_1040_">
        <path
          id="XMLID_1041_"
          fill="#6DA8D6"
          d="M335 185c0-20.397 15.27-37.216 35-39.678V75H0v70.322c19.73 2.462 35 19.281 35 39.678s-15.27 37.216-35 39.678V295h370v-70.322c-19.73-2.462-35-19.281-35-39.678"
        ></path>
        <path id="XMLID_44_" fill="#C1E8E6" d="M65 130h240v110H65z"></path>
        <path
          id="XMLID_1044_"
          fill="#2974A8"
          d="M370 145.322V75H185v220h185v-70.322c-19.73-2.462-35-19.281-35-39.678s15.27-37.216 35-39.678"
        ></path>
        <path
          id="XMLID_1047_"
          fill="#8EC8F0"
          d="M185 130v65h20v20h-20v25h120V130z"
        ></path>
        <path id="XMLID_37_" fill="#6DA8D6" d="M95 195h40v20H95z"></path>
        <path id="XMLID_34_" fill="#2974A8" d="M165 195h40v20h-40z"></path>
        <path id="XMLID_3_" fill="#2974A8" d="M235 195h40v20h-40z"></path>
      </g>
    </g>
  </svg>
);

