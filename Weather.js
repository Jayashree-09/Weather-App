const apiKey = "adc04a894abb28c614e4aaed98ef6b1a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const tempElement = document.querySelector(".temp");
const weatherIcon = document.querySelector(".weather-icon");
const descriptionElement = document.querySelector(".description");
const errorText = document.querySelector(".error");
let isCelsius = true;
let tempCelsius;

async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        updateWeatherData(data);
    } catch {
        errorText.style.display = "block";
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) throw new Error("Weather data not found");
        const data = await response.json();
        updateWeatherData(data);
        
        // ✅ Clear the search box when fetching location-based weather
        searchBox.value = "";
    } catch {
        alert("Could not fetch weather data");
    }
}

function updateWeatherData(data) {
    tempCelsius = data.main.temp;
    tempElement.textContent = `${Math.round(tempCelsius)}°C`;
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `Wind Speed: ${data.wind.speed} km/h`;
    descriptionElement.textContent = data.weather[0].description;
    
    document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    if (city) {
        errorText.style.display = "none";
        fetchWeather(city);
    }
});

document.getElementById("convertTemp").addEventListener("click", () => {
    if (isCelsius) {
        tempElement.textContent = `${Math.round(tempCelsius * 9/5 + 32)}°F`;
        isCelsius = false;
    } else {
        tempElement.textContent = `${Math.round(tempCelsius)}°C`;
        isCelsius = true;
    }
});

document.getElementById("currentLocationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
            () => alert("Location access denied. Please enable location.")
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
