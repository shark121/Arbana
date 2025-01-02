import { useLoadScript } from "@react-google-maps/api"
import Map from "./map"

const libs=["places"]


function MapPage(){

  const {isLoaded}= useLoadScript({
    googleMapsApiKey:"AIzaSyA-64RA4rucgeX4DmyResUJ3uux2SJyV2g",
    libraries: libs

  })

  if(!isLoaded) return <div>Loading</div>

   return <Map/>
}


export default MapPage