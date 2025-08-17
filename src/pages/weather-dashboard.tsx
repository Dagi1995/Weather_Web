import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use_geolocation";
import { WeatherSkeleton } from "@/components/loading_skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use_weather";
import CurrentWeather from "../components/current_weather";
import HourlyTemprature from "@/components/hourly_temprature";
import WeatherDetails from "../components/weatherDetails";
import WeatherForcast from "@/components/WeatherForcast";

const WeatherDashboard = () => {
  const {
    Coordinates,
    error: loctionError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(Coordinates);
  const forecastQuery = useForecastQuery(Coordinates);
  const locationQuery = useReverseGeocodeQuery(Coordinates);

  const handleRefresh = () => {
    getLocation();
    if (Coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };
  if (locationLoading) {
    return <WeatherSkeleton></WeatherSkeleton>;
  }
  if (loctionError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{loctionError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Loction
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!Coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather </p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Loction
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Feild to fetch weather data.Please try again</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/*Favorite Cities*/}
      <div className="flex items-center justify-between">
        <h1 className="text-x1 font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          ></RefreshCw>
        </Button>
      </div>
      <div className="grid gab-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemprature data={forecastQuery.data}></HourlyTemprature>
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start" >
          <WeatherDetails data={weatherQuery.data}></WeatherDetails>
          <WeatherForcast data ={forecastQuery.data}/>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
