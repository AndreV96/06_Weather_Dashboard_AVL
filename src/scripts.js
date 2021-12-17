
var mainDivEl = $("#mainDiv")
var resultTodaySectionEl = $("#resultTodaySection")
var resultForecastSectionEl = $("#resultForecastSection")
var searchBtnEl = $("#searchBtn")

var cities = ["Atlanta", "San diego", "Los Angeles", "Houston", "Dallas"]
// Search for icons here: https://fontawesome.com/v6.0/icons/cloud-moon?s=solid


// Functions
function createHTML() {
    const resultTodayHTML = `
    <h1 class="text-xl font-bold">Atlanta (3/30/2021)</h2>
    <i class="fa-solid fa-cloud-moon inline-block"></i>
    <p>Temp: <span>74°F</span></p>
    <p>Wind: <span>6.67 MPH</span></p>
    <p>Humidity: <span>46%</span></p>
    <p>UV index: <span>0.47</span></p>
    `
    // const resultForecastHTML = `
    // <h1 class="text-xl font-bold">${city} (3/30/2021)</h2>
    // <i class="fa-solid fa-cloud-moon inline-block"></i>
    // <p>Temp: <span>74°F</span></p>
    // <p>Wind: <span>6.67 MPH</span></p>
    // <p>Humidity: <span>46%</span></p>
    // `
    resultTodaySectionEl.html(resultTodayHTML)
    // for (i = 0; i < cities.length; i++){
    //     city = cities[i]
    //     const divEl = document.createElement("div");
    //     divEl.html(resultForecastHTML)
    //     resultForecastSectionEl.apppend(divEl)
    // }
}
// Event listeners
mainDivEl.on('click', searchBtnEl, function () {
    createHTML();
});