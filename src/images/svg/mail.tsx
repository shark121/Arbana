import * as React from "react";

const SvgIcon = ({size}:{size?:string}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    version="1.1"
    viewBox="0 0 505 505"
    height={size ?? 200}
    width={size ??200}
  >
    <circle cx="252.5" cy="252.5" r="252.5" fill="#324A5E"></circle>
    <path
      fill="#FFD05B"
      d="M242.4 306.7V505c-14-.6-27.7-2.3-41.1-5-10.9-2.2-21.5-5.2-31.8-8.8V306.7z"
    ></path>
    <path
      fill="#F9B54C"
      d="M242.4 306.7V505c-14-.6-27.7-2.3-41.1-5V306.7z"
    ></path>
    <path
      fill="#FF7058"
      d="M307.2 125v204H61.6V208.8c0-46.2 37.5-83.8 83.8-83.8z"
    ></path>
    <path
      fill="#F1543F"
      d="M391 329H223.5V208.8c0-46.3 37.5-83.8 83.8-83.8s83.8 37.5 83.8 83.8V329z"
    ></path>
    <path
      fill="#E6E9EE"
      d="M443.4 185v84.1c0 4.4-1.8 8.4-4.8 11.2-2.8 2.7-6.7 4.4-10.8 4.4H281.9c-4.2 0-8-1.7-10.8-4.4-3-2.8-4.8-6.8-4.8-11.2V185c0-4.4 1.8-8.4 4.8-11.2 2.8-2.7 6.6-4.4 10.8-4.4h145.9c4.2 0 8 1.7 10.8 4.4 3 2.8 4.8 6.8 4.8 11.2"
    ></path>
    <path
      fill="#CED5E0"
      d="M438.6 280.3c-2.8 2.7-6.7 4.4-10.8 4.4H281.9c-4.2 0-8-1.7-10.8-4.4l83.8-76.9z"
    ></path>
    <path
      fill="#FFF"
      d="m438.6 173.7-83.8 76.8-83.8-76.8c2.8-2.7 6.6-4.4 10.8-4.4h145.9c4.3.1 8.1 1.7 10.9 4.4"
    ></path>
    <path fill="#E6E9EE" d="M107.3 210h94.1v27.6h-94.1z"></path>
  </svg>
);

export default SvgIcon;
