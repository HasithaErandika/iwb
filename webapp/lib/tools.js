export async function fetchLatestNews(){
    const res = await fetch("http://localhost:5000/latest-news")
    if(!res.ok) throw new Error("failed to fetch news")
    return res.json()
}

export async function fetchWeather(){
    const res = await fetch("http://localhost:8080/api/weather")
    if(!res.ok) throw new Error("failed to fetch weather")
    return res.json()
}

export async function fetchCurrencyConversion(amount, base, target = "LKR"){
    const res = await fetch(`http://localhost:8080/api/convert?amount=${amount}&base=${base}&target=${target}`)
    if(!res.ok) throw new Error("failed to fetch currency conversion")
    return res.json()
}