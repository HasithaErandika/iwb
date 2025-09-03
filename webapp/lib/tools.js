import { getAuthHeaders } from "./api";

export async function fetchLatestNews(session){
    const res = await fetch("http://localhost:8080/api/latest-news", {
        headers: getAuthHeaders(session)
    })
    if(!res.ok) throw new Error("failed to fetch news")
    return res.json()
}
export async function fetchWeather(session){
    const headers = getAuthHeaders(session);
    console.log("Weather headers:", headers);
    console.log("Session in fetchWeather:", session);
    const res = await fetch("http://localhost:8080/api/weather", {
        headers: getAuthHeaders(session)
    })
    if(!res.ok) throw new Error("failed to fetch weather")
    return res.json()
}

export async function fetchCurrencyConversion(amount, base, target = "LKR", session){
    const res = await fetch(
        `http://localhost:8080/api/convert?amount=${amount}&base=${base}&target=${target}`,
        { headers: getAuthHeaders(session) }
    )
    if(!res.ok) throw new Error("failed to fetch currency conversion")
    return res.json()
}
