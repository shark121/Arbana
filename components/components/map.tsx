import React from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

export default function MapComponent({
  width,
  height,
  defaultCenter,
  defaultZoom,
  gestureHandling,
  disableDefaultUI,
  markerPosition,
}: {
  width?: string;
  height?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  gestureHandling?: string;
  disableDefaultUI?: boolean;
  markerPosition?: { lat: number; lng: number };
}) {
  return (
    <APIProvider apiKey={"AIzaSyDLTdUVBLgQlGbxhpX5Oyp26QUoY7esJNA"}>
      <Map
        style={{ width: width ?? "100vh", height: height ?? "100vh" }}
        defaultCenter={defaultCenter ?? { lat: 22.54992, lng: 0 }}
        defaultZoom={defaultZoom ?? 3}
        gestureHandling={gestureHandling ?? "greedy"}
        disableDefaultUI={disableDefaultUI ?? true}
      >
        {/* <AdvancedMarker position={defaultCenter} /> */}
      </Map>
    </APIProvider>
  );
}
