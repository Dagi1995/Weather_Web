import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
interface WeatherForecastProps {
  data: ForecastData;
}
interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}
const WeatherForcast = ({ data }: WeatherForecastProps) => {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {} as Record<string, DailyForecast>);
  console.log(dailyForecasts);
  const nextDays = Object.values(dailyForecasts).slice(0, 6);
  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {day.weather.description}
                </p>
                <p className="text-xs">💨 {day.wind} m/s</p>
                <p className="text-xs">💧 {day.humidity}%</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                  alt={day.weather.description}
                  className="w-12 h-12"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForcast;
