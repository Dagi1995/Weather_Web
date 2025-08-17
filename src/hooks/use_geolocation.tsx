import { useEffect, useState } from "react";
import type { Coordinates } from '../api/types';


interface GeolocationState{
    Coordinates: Coordinates | null;
    error:string | null;
    isLoading:boolean;
}

export function useGeolocation() {

   const [locationData, setLoctionData] = useState<GeolocationState>({
    Coordinates: null,
    error: null,
    isLoading: true,
   });
   const getLocation = () => {
    setLoctionData((prev) => ({ ...prev, isLoading: true, error: null }));
    if(!navigator.geolocation){
        setLoctionData ({
            Coordinates: null,
            isLoading: false,
            error: "Geolocation is not supported by this browser.",
        });
        return;
    }
    
    navigator.geolocation.getCurrentPosition((position) => { 
        setLoctionData({
            Coordinates: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            },
            error: null,
            isLoading:false,
        });
    },(error)=>{
        let errorMessage:string;
        switch (error.code){
            case error.PERMISSION_DENIED:
                errorMessage=
                "Location permission demied.Please enable location access.";
                break;
        
        case error.POSITION_UNAVAILABLE:
                errorMessage=
                "Location information is unavailable.";
                break;
        
        case error.TIMEOUT:
                errorMessage=
                "Location request is timeout.";
                break;
        default:
            errorMessage="An unknown error occured";

        }

        setLoctionData({
            Coordinates: null,
            error: errorMessage,
            isLoading: false,
        });
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0

    })

   }

   useEffect(() => {
    getLocation();
   },[]);
   return{
    ...locationData,
    getLocation,
   }

}
