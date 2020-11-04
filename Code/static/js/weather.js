/** processForm: get data from form and make AJAX call to our API. */
async function processForm(evt) {
    evt.preventDefault();

    let response = await axios.post("https://api.openweathermap.org/data/2.5/onecall?lat=32.72&lon=-117.16&units=imperial&appid=a56c679ee3a5006c6db11c09fc6707f0");

    console.log(response.data);

    $("#main-content").html("<h4>Current weather</h4>").append(response.data.current.temp, " ºF");
}

$("#search-form").on("submit", processForm);