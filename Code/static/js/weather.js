import {WEATHER_API_KEY, LOCATION_API_KEY} from "./secrets.js";

/** processForm: get data from form and make AJAX call to our API. */
async function processForm(evt) {
    evt.preventDefault();

    let $search = $("#search-box").val();

    console.log($search);

    // this endpoint is used in order to search by city name
    // also access to current weather
    let respCurrent = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${$search}&units=imperial&appid=${WEATHER_API_KEY}`);

    let lat = respCurrent.data.coord.lat;
    let lon = respCurrent.data.coord.lon;
    let weatherIcon = respCurrent.data.weather[0].icon;

    // calling to this endpoint only accepts coordinates
    // calling to acces to get a 7 days forcase, hourly forcast up to 48 hrs
    let respFuture = await axios.post(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${WEATHER_API_KEY}`);

    console.log("Current forecast", respCurrent);
    console.log("lat", lat);
    console.log("lon", lon);
    console.log("Future forecast", respFuture);

    let currentForecastHTML = `
                <h2 class='col-12 text-center'>Current Forecast</h2>
                <div class="row">
                    <div class="col-md-12 text-center">
                        <img class="" src="http://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="weather icon"/>
                        <span class="display-3">${Math.round(respCurrent.data.main.temp)} ºF</span>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 text-center">
                        <p class=""><b>${respCurrent.data.weather[0].main.toUpperCase()}</b></p>
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p><b>Latitude:</b> ${respCurrent.data.coord.lat}</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class=""><b>Longitude:</b> ${respCurrent.data.coord.lon} ºF</p>
                    </div>

                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p><b>Timezone:</b> ${respFuture.data.timezone}</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class=""><b>Real feels:</b> ${respCurrent.data.main.feels_like} ºF</p>
                    </div>

                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p class=""><b>Cloudiness:</b> ${respCurrent.data.clouds.all} %</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class=""><b>Visibility:</b> ${meterToMile(respCurrent.data.visibility)} miles</p>
                    </div>

                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p class=""><b>Humidity:</b> ${respCurrent.data.main.humidity} %</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class=""><b>Pressure:</b> ${respCurrent.data.main.pressure} hPa</p>
                    </div>

                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p class=""><b>Wind direction:</b> ${respCurrent.data.wind.deg} °</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p class=""><b>Wind speed:</b> ${respCurrent.data.wind.speed} miles/hour</p>
                    </div>
            
                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p><b>Low:</b> ${respCurrent.data.main.temp_min} ºF</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p><b>High:</b> ${respCurrent.data.main.temp_max} ºF</p>
                    </div>

                    <div class="col-md-12">
                        <hr/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <p><b>Sunrise:</b> ${secondsToTime(respCurrent.data.sys.sunrise)}</p>
                    </div>
                    <div class="col-md-6 text-right">
                        <p><b>Sunset:</b> ${secondsToTime(respCurrent.data.sys.sunset)}</p>
                    </div>
                </div>
            `;

    console.log("Daily forecast", respFuture.data.daily);
    
    $("#main-content").html(currentForecastHTML)
    .append("<h2 class='col-12 text-center'>Daily Forecast</h2>");

    for (let i = 1; i < respFuture.data.daily.length; i++) {
        $("#main-content").append(createDailyForecastHTML(respFuture.data.daily[i]));
    }
    
}

$("#search-form").on("submit", processForm);

// Fetching data from API then display it
async function getPointOfInterest() {
    let $city = $("#city").text();
    let $countryCode = $("#country").text();

    console.log("City", $city);
    console.log("Country", $countryCode);

    // call this endpoint the by providing city and country 2 digits code to get lat and lon
    let respCoords = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname?name=${$city}&country=${$countryCode}&apikey=${LOCATION_API_KEY}`);
    

    let lon = respCoords.data.lon;
    let lat = respCoords.data.lat;

    // call this endpoint to get the unique id for each place
    // each unique id is defined by opentripmap api
    let respId = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&apikey=${LOCATION_API_KEY}`);

    let randomNum = Math.floor(Math.random() * respId.data.features.length);
    let id = respId.data.features[randomNum].properties.xid;

    // call this endpoint to get the POI details
    let respPlaceDetails = await axios.get(`https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${LOCATION_API_KEY}`);

    let contentHTML = `
                        <div id="attraction-details">
                            <h2 class="text-center">${respId.data.features[randomNum].properties.name ? respId.data.features[randomNum].properties.name : "Location's name not available"}</h2>
                            <div class="row">
                                <p class="col-md-6"><b>Timezone:</b> ${respCoords.data.timezone}</p>
                                <p class="col-md-6"><b>Population:</b> ${respCoords.data.population}</p>
                            </div>
                            
                            <div class="row">
                                <p class="col-md-6"><b>State:</b> ${respPlaceDetails.data.address.state ? respPlaceDetails.data.address.state : "N/A"}</p>
                                <p class="col-md-6"><b>Neighborhood:</b> ${respPlaceDetails.data.address ? respPlaceDetails.data.address.neighbourhood : "N/A"}</p>
                            </div>

                            <div class="row">
                                <p class="col-md-6"><b>County:</b> ${respPlaceDetails.data.address.county ? respPlaceDetails.data.address.county : "N/A"}</p>
                                <p class="col-md-6"><b>Street:</b> ${respPlaceDetails.data.address.road ? respPlaceDetails.data.address.road : "N/A"}</p>
                            </div>

                            <div class="row">
                                <img class="col-md-12" src="${respPlaceDetails.data.preview ? respPlaceDetails.data.preview.source : 'https://via.placeholder.com/500x300?text=No+image+available'}"/>
                            </div>
                            
                            <div class="row">
                                <p class="col-md-12">${respPlaceDetails.data.wikipedia_extracts ? respPlaceDetails.data.wikipedia_extracts.text : "No description avaialble."}</p>
                            </div>
                        </div>
                    `;

    $("#recommendation").html(contentHTML);

    console.log("Random num", randomNum);
    console.log("Resp lat&lon", respCoords.data);
    console.log("Resp unique xid", respId.data);
    console.log("Resp POI details", respPlaceDetails.data);
}

$("#recommendation-btn").on("click", getPointOfInterest);

// construct HTML content for daily forecast
function createDailyForecastHTML(forecast) {
    console.log("Daily forecast for loop", forecast);
    let html = `
            <div class="row" style="background-color: white;">
                <div class="daily-forecast col-md-2">
                    <p class="">${secondsToDate(forecast.dt)}</p>
                </div>

                <div class="daily-forecast col-md-2">
                    <img class="" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather icon"/>
                </div>

                <div class="daily-forecast col-md-2">
                    <p class=""><span class="daily-max">${Math.round(forecast.temp.max)} ºF</span>/<span class="daily-min">${Math.round(forecast.temp.min)} ºF</span></p>
                </div>

                <div class="daily-forecast col-md-3">
                    <p class="">Sunrise: ${secondsToTime(forecast.sunrise)}</p>
                </div>

                <div class="daily-forecast col-md-3">
                    <p class="">Sunset: ${secondsToTime(forecast.sunset)}</p>
                </div>
            </div>
            <br/>
        `;

    return html;
}

function hideElements() {
    
}

// convert from metric meter to imperial mile
function meterToMile(meter) {
    let mile = meter * 0.000621371;

    return Math.round(mile);
}

// convert time in seconds to human readable time
function secondsToTime(seconds) {
    let milliseconds = seconds * 1000;
    let date = new Date(milliseconds);

    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

// convert time in seconds to human readable date
function secondsToDate(seconds) {
    let milliseconds = seconds * 1000;
    let date = new Date(milliseconds);

    return date.toLocaleDateString("en-US", { weekday: 'short', month: '2-digit', day: '2-digit'});
}