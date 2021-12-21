
var mainDivEl = $("#mainDiv")
var resultTodaySectionEl = $("#resultTodaySection")
var resultForecastSectionEl = $("#resultForecastSection")
var searchBtnEl = $("#searchBtn")
var prevCitiesListEl = $("#prevCitiesList")

let prevCitiesArray = []

let inputCityString;

// Search for icons here: https://fontawesome.com/v6.0/icons/cloud-moon?s=solid

const exampleCall = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&units=imperial&appid=acf279683d77cfa942d0855d6b194227"

// Functions
function storeCity() {
    prevCitiesString = localStorage.getItem("Previous cities")
    if (prevCitiesString != null) prevCitiesArray = prevCitiesString.split(",")
    prevCitiesArray.unshift(inputCityString)
    prevCitiesArray = new Set(prevCitiesArray)
    prevCitiesString = Array.from(prevCitiesArray).join(",") 
    prevCitiesArray = prevCitiesString.split(",")
    localStorage.setItem('Previous cities', prevCitiesString)
    renderPrevCities()
}
function renderPrevCities() {
    prevCitiesListEl.html("");
    for (i = 0; i < prevCitiesArray.length; i++) {
        const prevCityName = prevCitiesArray[i]
        const prevCityEl = $("<li>");
        prevCityEl.html(`
        <button id="prevCityBtn" class="block text-center text-bold bg-gray-400 w-full rounded-md mb-2 capitalize">${prevCityName} </button>
        `);
        prevCitiesListEl.append(prevCityEl);
    };
};
function getWeather(url) {
    fetch(url).then(response => response.json()).then(data => {
        console.log(data)
        createHTML(data)
    })
}
function getCoordinates(url) {
    fetch(url).then(response => response.json()).then(data => {
        const lat = data[0].lat
        const lon = data[0].lon
        const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=acf279683d77cfa942d0855d6b194227"
        getWeather(weatherURL)
    })
}
function createHTML(weatherData) {
    const currentTemp = weatherData.current.temp;
    const currentWind = weatherData.current.wind_speed;
    const currentHumid = weatherData.current.humidity;
    const currentUVI = weatherData.current.uvi;
    let lvlClass;
    if (currentUVI < 3) lvlClass = "bg-green-400" 
    if (currentUVI >= 3 && currentUVI < 6 ) lvlClass = "bg-yellow-400"
    if (currentUVI >= 6 && currentUVI < 8 ) lvlClass = "bg-orange-400"
    if (currentUVI >= 8) lvlClass = "bg-red-400"
    const resultTodayHTML = `
    <h1 class="text-xl font-bold capitalize">${inputCityString} *</h2>
    <i class="fa-solid fa-cloud-moon inline-block"></i>
    <p>Temp: <span>${currentTemp}°</span></p>
    <p>Wind: <span>${currentWind} MPH</span></p>
    <p>Humidity: <span>${currentHumid}%</span></p>
    <p>UV index: <span class="${lvlClass} rounded-md p-1">${currentUVI}</span></p>
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
function eventClick() {
    inputCityString = $(this).siblings("input").val()
    const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ inputCityString + "&appid=acf279683d77cfa942d0855d6b194227"
    getCoordinates(geoURL)
    storeCity()
    
}
// Event listeners
mainDivEl.on('click', "button", eventClick);

//Calls