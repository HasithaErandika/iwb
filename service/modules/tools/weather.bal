import ballerina/http;

configurable string openWeatherApi = ?;

final http:Client weatherClient = check new ("https://api.openweathermap.org");

public type WeatherData record {|
    float temperature;
    string description;
    string main;
    string location;
|};

public type WeatherResponse record {|
    boolean success;
    string message;
    WeatherData? data?;
|};

public isolated function getCurrentWeather() returns WeatherResponse|error {
    string path = string `/data/3.0/onecall?lat=7.8731&lon=80.7718&appid=${openWeatherApi}`;

    json response = check weatherClient->get(path);
    json current = check response.current;

    float temperature = check current.temp;
    json[] weatherArray = check (check current.weather).ensureType();
    json firstWeather = weatherArray[0];

    return {
        success: true,
        message: "Weather data fetched successfully",
        data: {
            temperature: temperature,
            description: check firstWeather.description,
            main: check firstWeather.main,
            location: "Sri Lanka"
        }
    };
}
