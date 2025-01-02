import React from "react";

function  GoogleMapEmbed({location}:{location:string}){
  const iframeSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location}`;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default GoogleMapEmbed;
