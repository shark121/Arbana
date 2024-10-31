"use client"
import { useState, CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
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
        speedMultiplier={0.7}
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
}
