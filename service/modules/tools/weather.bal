import ballerina/http;
import ballerina/regex;

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

// Lightweight HTML scraping for latest news from newswire.lk
public isolated function getLatestNewsFromNewswire(int limit) returns json|error {
    final string NEWSWIRE_URL = "https://www.newswire.lk/";
    http:Client client = check new (NEWSWIRE_URL);
    http:Response resp = check client->get("/");
    if resp.statusCode != 200 {
        return error("unexpected status: " + resp.statusCode.toString());
    }
    string|error html = resp.getTextPayload();
    if html is error {
        return html;
    }

    // Regex-based extraction of title/link/time elements
    final string H4_RE = "<h4[^>]*posts-listunit-title[^>]*>\\s*<a[^>]*href=\\\"([^\\\"]+)\\\"[^>]*>(.*?)</a>\\s*</h4>";
    final string TIME_RE = "<time[^>]*entry-published[^>]*>(.*?)</time>";

    json[] items = [];
    int count = 0;
    // Use ballerina/regex at function scope to avoid import collisions
    var h4Matcher = check regex:matcher(html, H4_RE, {caseInsensitive: true, dotAll: true});
    var timeMatcher = check regex:matcher(html, TIME_RE, {caseInsensitive: true, dotAll: true});
    while h4Matcher.find() {
        count += 1;
        string link = check h4Matcher.group(1);
        string rawTitle = check h4Matcher.group(2);
        string title = rawTitle.replaceAll("<[^>]+>", "").trim();
        string date = "";
        if timeMatcher.find() {
            date = check timeMatcher.group(1);
        }
        items.push({title, date, link});
        if count >= limit { break; }
    }
    return items;
}
