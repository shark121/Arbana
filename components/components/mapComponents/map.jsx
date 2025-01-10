"use client";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { use, useState, useEffect } from "react";
import ShowPalces from "./showPlaces";

const containerStyle = {
  height: "100%",
  width: "100%",
};

const centerOriginal = {
  lat: 6.684975629854296,
  lng: -1.5773772053210848,
};

const destination = {
  lat: 38.78292384232595,
  lng: -77.47093240937981,
};

function Map({latLng}) {

  const [directions, setDirections] = useState();
  const [center, setCenter] = useState(centerOriginal);
  const [userCoords, setUserCoords] = useState();

  function getUserCoords() {
    return navigator.geolocation.getCurrentPosition(
      function (position) {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function (error) {
        console.error("Error Code: " + error.code + " - " + error.message);
      }
    );
  }

  useEffect(() => {
    getUserCoords();
  }, []);

  function drawLine() {
    let service = new google.maps.DirectionsService();

    service.route(
      {
        destination: latLng,
        origin: userCoords,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status == "OK") {
          setDirections(result);
        }
      }
    );
  }

  useEffect(() => {
    if (userCoords) {
      // setCenter(userCoords);
      setCenter(userCoords);
      console.log(userCoords, "user coords");
      drawLine();
    }

  }, [userCoords]);

  return (
    <div className="h-screen w-screen relative">
      <div className="w-full h-full">
        <GoogleMap
          zoom={15}
          mapContainerStyle={containerStyle}
          center={destination}
          options={{
            disableDefaultUI: true,
          }}
        >
          {userCoords ? (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "red",
                  
                },
                
                // markerOptions: {

                //   icon: {
                //     url: "https://cdn-icons-png.flaticon.com/512/124/124021.png",
                //     scaledSize: new google.maps.Size(30, 30),
                //   },
                // }
              }}
            />
          ) : (
            <Marker position={destination} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Map;
