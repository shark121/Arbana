"use client"
import { useState, CSSProperties } from "react";
import SyncLoader from "react-spinners/MoonLoader";

// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

export default function LoaderComponent() {

  return (
      <SyncLoader
        color={"#000000"}
        size={14}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
}
