"use client"
import React from "react";

export default function Error({
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
      viewBox="0 0 60 60"
      xmlSpace="preserve"
    >
      <path d="M9 39h6v8a1 1 0 002 0v-8h3a1 1 0 000-2h-3v-2a1 1 0 00-2 0v2h-5V27a1 1 0 00-2 0v11a1 1 0 001 1zM40 39h6v8a1 1 0 002 0v-8h3a1 1 0 000-2h-3v-2a1 1 0 00-2 0v2h-5V27a1 1 0 00-2 0v11a1 1 0 001 1zM29.5 48c3.584 0 6.5-2.916 6.5-6.5v-9c0-3.584-2.916-6.5-6.5-6.5S23 28.916 23 32.5v9c0 3.584 2.916 6.5 6.5 6.5zM25 32.5c0-2.481 2.019-4.5 4.5-4.5s4.5 2.019 4.5 4.5v9c0 2.481-2.019 4.5-4.5 4.5S25 43.981 25 41.5v-9z"></path>
      <path d="M0 0v60h60V0H0zm2 2h56v10H2V2zm56 56H2V14h56v44z"></path>
      <path d="M54.293 3.293L52 5.586 49.707 3.293 48.293 4.707 50.586 7 48.293 9.293 49.707 10.707 52 8.414 54.293 10.707 55.707 9.293 53.414 7 55.707 4.707z"></path>
      <path d="M3 11h39V3H3v8zm2-6h35v4H5V5z"></path>
    </svg>
  );
}
