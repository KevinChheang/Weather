// import {API_KEY} from "./secrets.js";

/** processForm: get data from form and make AJAX call to our API. */
async function processForm(evt) {
    evt.preventDefault();

    let $search = $("#search-box").val();

    console.log($search);

    // this endpoint is used in order to search by city name
    // also access to current weather
    let respCurrent = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${$search}&units=imperial&appid=a56c679ee3a5006c6db11c09fc6707f0`);

    let lat = respCurrent.data.coord.lat;
    let lon = respCurrent.data.coord.lon;
    let weatherIcon = respCurrent.data.weather[0].icon;

    // calling to this endpoint only accepts coordinates
    // calling to acces to get a 7 days forcase, hourly forcast up to 48 hrs
    let respFuture = await axios.post(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=a56c679ee3a5006c6db11c09fc6707f0`);

    console.log("Current forecast", respCurrent);
    console.log("lat", lat);
    console.log("lon", lon);
    // console.log("API KEY", API_KEY);

    contentHTML = `
                <h4 class='col-12 text-center'>Current weather</h4>
                <div class="col-auto-8 card">
                    <img class="card-img-top" src=http://openweathermap.org/img/wn/${weatherIcon}@4x.png alt=weather icon>
                    <div class="card-body text-center">
                        <p class=""><b>Temperature:</b> ${respCurrent.data.main.temp} ºF</p>
                        <p class="card-title"><b>${respCurrent.data.weather[0].description.toUpperCase()}</b></p>
                        <p><b>Timezone:</b> ${respFuture.data.timezone}</p>
                        <p class=><b>Real feels:</b> ${respCurrent.data.main.feels_like} ºF</p>
                        <p><b>Humidity:</b> ${respCurrent.data.main.humidity}</p>
                        <p><b>Low:</b> ${respCurrent.data.main.temp_min} ºF</p>
                        <p><b>High:</b> ${respCurrent.data.main.temp_max} ºF</p>
                    </div>
                </div>
            `;
    
    $("#main-content").html(contentHTML);
}

$("#search-form").on("submit", processForm);

// async function getPlaces() {
//     let responce = await axios.get("http://localhost:5000/trips");
//     let data = [];

//     for (const resp of responce.data) {
//         data.push(resp);
//     }

//     console.log("data", data);
//     return data;
// }

async function getPointOfInterest() {
    // let data = await getPlaces();

    // console.log("Cities", cities);

    let $city = $("#city").text();
    let $countryCode = $("#country").text();

    console.log("City", $city);
    console.log("Country", $countryCode);

    // call this endpoint the by providing city and country 2 digits code to get lat and lon
    let respCoords = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname?name=${$city}&country=${$countryCode}&apikey=5ae2e3f221c38a28845f05b6bab2c6955b8fbc553f1b4609a7d7cb56`);
    

    let lon = respCoords.data.lon;
    let lat = respCoords.data.lat;

    // call this endpoint to get the unique id for each place
    // each unique id is defined by opentripmap api
    let respId = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${lon}&lat=${lat}&apikey=5ae2e3f221c38a28845f05b6bab2c6955b8fbc553f1b4609a7d7cb56`);

    let randomNum = Math.floor(Math.random() * respId.data.features.length);
    let id = respId.data.features[randomNum].properties.xid;

    // call this endpoint to get the POI details
    let respPlaceDetails = await axios.get(`https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=5ae2e3f221c38a28845f05b6bab2c6955b8fbc553f1b4609a7d7cb56`);

    let contentHTML = `
                        <h3 class="text-center">Location Details</h3>
                        <div class="row">
                            <p class="col-md-6"><b>Timezone:</b> ${respCoords.data.timezone}</p>
                            <p class="col-md-6"><b>Population:</b> ${respCoords.data.population}</p>
                        </div>
                        
                        <div class="row">
                            <p class="col-md-6"><b>Address:</b> ${respPlaceDetails.data.address.address29}</p>
                            <p class="col-md-6"><b>Neighborhood:</b> ${respPlaceDetails.data.address.neighbourhood}</p>
                            <p class="col-md-6"><b>County:</b> ${respPlaceDetails.data.address.county}</p>
                            <p class="col-md-6"><b>Street:</b> ${respPlaceDetails.data.address.road}</p>
                        </div>

                        <div class="row">
                            <p class="col-md-6"><b>Name:</b> ${respId.data.features[randomNum].properties.name}</p>
                            <p class="col-md-6"><b>Kinds:</b> ${respId.data.features[randomNum].properties.kinds}</p>
                        </div>

                        <div class="row">
                            <p class="col-md-12"><b>Description:</b></p>
                        </div>

                        <div class="row">
                            <img class="col-md-8" src="${respPlaceDetails.data.preview.source ? respPlaceDetails.data.preview.source : "https://via.placeholder.com/250"}"/>
                        </div>
                        
                        <div class="row">
                            <p class="col-md-12">${respPlaceDetails.data.wikipedia_extracts.text ? respPlaceDetails.data.wikipedia_extracts.text : "N/A"}</p>
                        </div>
                    `;

    $("#recommendation").html(contentHTML);

    console.log("Random num", randomNum);
    console.log("Resp lat&lon", respCoords.data);
    console.log("Resp unique xid", respId.data);
    console.log("Resp POI details", respPlaceDetails.data);
}

$("#recommendation-btn").on("click", getPointOfInterest);