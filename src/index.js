import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getWeather(city) {
    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}
    `;

    request.addEventListener("loadend", function() {
        try {
            const response = JSON.parse(this.responseText);
            const lon = response.coord.lon;
            const lat = response.coord.lat;
            printElements(response, city);
            getAirPollution(lon, lat, city); // Pass lon and lat to getAirPollution()
        } catch (error) {
            printError(this, error, city);
        }
    });

    request.open("GET", url, true);
    request.send();
}

function getAirPollution (lon, lat, city) {
    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`;
    request.addEventListener("loadend", function() {
        try {
            const response = JSON.parse(this.responseText);
            printPollutionElements(response, city);
        } catch (error) {
            printError(this, error, city);
        }
    });

    request.open("GET", url, true);
    request.send();
}


// UI Logic

function printElements(apiResponse, city) {
    document.querySelector('#showResponse').innerText = `The humidity in ${city} is ${apiResponse.main.humidity}%.
    The temperature in Kelvins is ${apiResponse.main.temp} degrees.
    The temperature in Fahrenheit is ${((apiResponse.main.temp - 273.15) * 9/5 + 32).toFixed(2)} degrees.
    Feels like ${((apiResponse.main.feels_like - 273.15) * 9/5 + 32).toFixed(0)} degrees.
    With ${apiResponse.weather[0].description}
    And a high of ${((apiResponse.main.temp_max - 273.15) * 9/5 + 32).toFixed(0)} degrees.
    
    Sunrise: ${new Date(apiResponse.sys.sunrise * 1000).toLocaleTimeString("en-US")}
    Sunset: ${new Date(apiResponse.sys.sunset * 1000).toLocaleTimeString("en-US")}`;
}

function getAqiDescription(aqi) {
    switch (aqi) {
    case 1:
        return "Good";
    case 2:
        return "Fair";
    case 3:
        return "Moderate";
    case 4:
        return "Poor";
    case 5:
        return "Very Poor";
    default:
        return "Unknown";
    }
}

function printPollutionElements(apiResponse, city) {
    let aqi = apiResponse.list[0].main.aqi;
    let aqiQualitiveName = getAqiDescription(aqi);
    // document.querySelector('#showairResponse').innerText = `Air Quality in ${city} is ${apiResponse.list[0].main.aqi}.
    // `;
    document.querySelector('#showairResponse').innerText = `Air Quality in ${city} is ${aqiQualitiveName}.
    `;
}

function printError(request, apiResponse, city) {
    document.querySelector('#showResponse').innerHTML = `There was an error accessing the weather data for "${city}"
    <br>
    <strong>${request.status}</strong> | <strong>${request.statusText}:</strong> <em>${apiResponse.message}</em>`;
}

function handleWeatherFormSubmission(event) {
    event.preventDefault();
    const city = document.querySelector('#location').value;
    document.querySelector('#location').value = null;
    getWeather(city);
    document.getElementById("air-pol-stats").removeAttribute("class", "hidden");
}

window.addEventListener("load", function() {
    document.querySelector('#weather-form').addEventListener("submit", handleWeatherFormSubmission);
});
