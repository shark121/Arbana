import { useEffect, useState } from "react";
import Autocomplete from "./autocomplete";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// const items = [
//   { id: 1, name: "Wade Cooper" },
//   { id: 2, name: "Arlene Mccoy" },
//   { id: 3, name: "Devon Webb" },
//   { id: 4, name: "Tom Cook" },
//   { id: 5, name: "Tanya Fox" },
//   { id: 6, name: "Hellen Schmidt" },
// ];

function ShowPlaces({
  selected,
  setSelected,
  selectedPlace,
  setSelectedPlace,
}) {
  // const [selected, setSelected] = useState({ id: 0, description: "" });
  // const [selectedPlace, setSelectedPlace] = useState({});

  const {
    value,
    setValue,
    ready,
    suggestions: { data, status },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    setValue(selected);
    console.log(data);
    console.log(selected);
  }, [selected]);

  useEffect(() => {
    console.log("changed");
    console.log(selectedPlace);
  }, [selectedPlace]);

  return (
    <Autocomplete
      selected={selected}
      setSelected={setSelected}
      items={data}
      setSelectedPlace={setSelectedPlace}
      selectedPlace={selectedPlace}
    />
  );
}

export default ShowPlaces;
