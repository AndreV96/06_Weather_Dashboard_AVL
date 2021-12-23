
var mainDivEl = $("#mainDiv");
var resultTodaySectionEl = $("#resultTodaySection");
var resultForecastSectionEl = $("#resultForecastSection");
var searchBtnEl = $("#searchBtn");
var prevCitiesListEl = $("#prevCitiesList");

let prevCitiesArray = [];
let prevCitiesString = localStorage.getItem("Previous cities");

let inputCityString;

// Moment variables
var moment = moment();
var currentDateG = moment.format('l');
const days = []
for (i = 0; i < 5; i++) {
    const day = moment.add(1, 'days').format('l')
    days.push(day)
    console.log(days)
}
// const tomorrow = moment.add(1, 'days').format('l')
// // const afterTomorrow = moment.add(1, 'days').format('l')
// console.log(tomorrow)
// console.log(afterTomorrow)

// Search for icons here: https://fontawesome.com/v6.0/icons/cloud-moon?s=solid

const exampleCall = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&units=imperial&appid=acf279683d77cfa942d0855d6b194227";

// Functions
function storeCity() {
    prevCitiesArray.unshift(inputCityString);
    prevCitiesArray = Array.from(new Set(prevCitiesArray));
    if (prevCitiesArray.length >= 9) prevCitiesArray.pop();
    prevCitiesString = prevCitiesArray.join(",");
    localStorage.setItem('Previous cities', prevCitiesString);
    renderPrevCities();
}
function renderPrevCities() {
    prevCitiesListEl.html("");

    for (i = 0; i < prevCitiesArray.length; i++) {
        const prevCityName = prevCitiesArray[i];
        const prevCityEl = $("<li>");
        prevCityEl.html(`
        <button id="prevCityBtn" class="block text-center text-bold bg-gray-400 w-full rounded-md mb-2 capitalize">${prevCityName}</button>
        `);
        prevCitiesListEl.append(prevCityEl);
    };
};
function getWeather(url) {
    fetch(url).then(response => response.json()).then(data => {
        createHTML(data)
    });
};
function getCoordinates(url) {
    fetch(url).then(response => response.json()).then(data => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=acf279683d77cfa942d0855d6b194227"
        getWeather(weatherURL);
    });
};
function createHTML(weatherData) {
    resultForecastSectionEl.html("")
    const currentData = weatherData.current;
    const currentTemp = currentData.temp;
    const currentWind = currentData.wind_speed;
    const currentHumid = currentData.humidity;
    const currentUVI = currentData.uvi;

    let lvlClass;
    if (currentUVI < 3) lvlClass = "bg-green-400";
    if (currentUVI >= 3 && currentUVI < 6 ) lvlClass = "bg-yellow-400";
    if (currentUVI >= 6 && currentUVI < 8 ) lvlClass = "bg-orange-400";
    if (currentUVI >= 8) lvlClass = "bg-red-400";
    const resultTodayHTML = `
    <h1 class="text-xl font-bold capitalize">${inputCityString} ${currentDateG}</h2>
    <i class="fa-solid fa-cloud-moon inline-block"></i>
    <p>Temp: <span>${currentTemp}°</span></p>
    <p>Wind: <span>${currentWind} MPH</span></p>
    <p>Humidity: <span>${currentHumid}%</span></p>
    <p>UV index: <span class="${lvlClass} rounded-md p-1">${currentUVI}</span></p>
    `
    resultTodaySectionEl.html(resultTodayHTML);
    for (i = 1; i < 6; i++) {        
    let resultForecastEl = document.createElement("div");
    let dailyData = weatherData.daily[i]
    let dailyTemp = dailyData.temp.day;
    let dailyWind = dailyData.wind_speed;
    let dailyHumid = dailyData.humidity;
    
    resultForecastEl.innerHTML = `
    <h1 class="text-xl font-bold capitalize">${inputCityString} ${days[i-1]}</h2>
    <i class="fa-solid fa-cloud-moon inline-block"></i>
    <p>Temp: <span>${dailyTemp}</span></p>
    <p>Wind: <span>${dailyWind} MPH</span></p>
    <p>Humidity: <span>${dailyHumid}</span></p>
    `
    resultForecastSectionEl.append(resultForecastEl);
    };
};
function inputSearch() {
    const inputEl = $(this).siblings("input");
    inputCityString = inputEl.val();
    inputEl.val("");
    searchEvent(inputCityString);
};
function prevCitiesSearch() {
    inputCityString = $(this).text();
    searchEvent(inputCityString);
};
function searchEvent(inputCityString) {
    const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ inputCityString + "&appid=acf279683d77cfa942d0855d6b194227"
    getCoordinates(geoURL);
    storeCity();
};
// Event listeners
mainDivEl.on('click', "#searchBtn", inputSearch);
mainDivEl.on('click', "#prevCityBtn", prevCitiesSearch);

//Calls
if (prevCitiesString != null) {
    prevCitiesArray = prevCitiesString.split(",");
    renderPrevCities();
};