
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// Convert weather codes into readable descriptions
function getWeatherCondition(code) {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 57) return "Drizzle";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 82) return "Rain showers";
    if (code <= 86) return "Snow showers";
    if (code <= 99) return "Thunderstorm";
    return "Unknown condition";
}

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";
    searchBtn.disabled = true;

    try {
        // Step 1: Find the city's coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Try another name.");
        }

        const place = geoData.results[0];

        // Step 2: Get weather using latitude and longitude
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const data = await weatherResponse.json();
        const current = data.current;

        // Step 3: Display the weather
        cityName.textContent =
            `${place.name}, ${place.country || ""}`;

        temperature.textContent =
            `Temperature: ${current.temperature_2m} °C`;

        condition.textContent =
            `Condition: ${getWeatherCondition(current.weather_code)}`;

        humidity.textContent =
            `Humidity: ${current.relative_humidity_2m}%`;

        wind.textContent =
            `Wind Speed: ${current.wind_speed_10m} km/h`;

        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchBtn.disabled = false;
    }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
