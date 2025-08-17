export interface Coordinates{
    lat:number;
    lon:number;
}

export interface weatherCondition{
    id:number;
    main:string;
    description:string;
    icon:string;
}

export interface WeatherData{
    coord:Coordinates;
    weather:weatherCondition[];
    main:{
        temp:number;
        feels_like:number;
        temp_min: number; 
        temp_max: number; 
        pressure:number;
        humidity:number;

    };
    wind:{
        speed:number;
        deg:number;
    };
    sys:{
        sunrise:number;
        sunset:number;
        country:number;

    };
    name:string;
    dt:number;
}
export interface ForecastData{
    list:Array<{
        dt:number;
        main:WeatherData["main"];
        weather:WeatherData["weather"];
        wind:WeatherData["wind"];
        dt_text:string;

    }>;
    city:{
        name:string;
        country:string;
        sunrise:number;
        sunset:number;
    };
}


export interface GeocodeResponse{
    name:string;
    local_name?:Record<string,string>;
    lat:number;
    lon:number; 
    country:string;
    state?:string;
}
