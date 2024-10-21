"use client"
import { useState, CSSProperties } from "react";
import SyncLoader from "react-spinners/MoonLoader";
import {COLORSMAP} from "../../data/colors"

// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

export default function LoaderComponent() {

  return (
      <SyncLoader
        color={COLORSMAP.primaryBlue}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
}
