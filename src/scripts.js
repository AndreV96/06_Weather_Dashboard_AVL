
var mainDivEl = $("#mainDiv");
var resultTodaySectionEl = $("#resultTodaySection");
var resultForecastSectionEl = $("#resultForecastSection");
var searchBtnEl = $("#searchBtn");
var prevCitiesListEl = $("#prevCitiesList");
var forecastH1El = $("#forecastH1")
var inputSearchEl = $("#inputSearch")

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
}

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
    const currentIconCode = currentData.weather[0].icon
    const currentIconURL = "https://openweathermap.org/img/wn/" + currentIconCode + "@2x.png"
    const currentTemp = currentData.temp;
    const currentWind = currentData.wind_speed;
    const currentHumid = currentData.humidity;
    const currentUVI = currentData.uvi;
    forecastH1El.removeClass("hidden")

    let lvlClass;
    if (currentUVI < 3) lvlClass = "bg-green-400";
    if (currentUVI >= 3 && currentUVI < 6 ) lvlClass = "bg-yellow-400";
    if (currentUVI >= 6 && currentUVI < 8 ) lvlClass = "bg-orange-400";
    if (currentUVI >= 8) lvlClass = "bg-red-400";
    resultTodaySectionEl.addClass("bg-gray-300")
    const resultTodayHTML = `
    <h1 class="text-xl font-bold capitalize inline-block">${inputCityString} ${currentDateG}</h1>
    <img class="w-14 h-20 inline-block pb-6" src="${currentIconURL}" alt="icon_id: ${currentIconCode}"> 
    <p>Temp: <span>${currentTemp}°</span></p>
    <p>Wind: <span>${currentWind} MPH</span></p>
    <p>Humidity: <span>${currentHumid}%</span></p>
    <p>UV index: <span class="${lvlClass} rounded-md p-1">${currentUVI}</span></p>
    `
    resultTodaySectionEl.html(resultTodayHTML);
    for (i = 1; i < 6; i++) {        
    let resultForecastEl = document.createElement("div");
    resultForecastEl.classList.add("mb-4", "bg-[#2d3e50]", "w-40", "text-white", "px-2", "font-bold", "border-2", "border-black")
    let dailyData = weatherData.daily[i]
    let dailyIconCode = dailyData.weather[0].icon
    let dailyIconURL = "https://openweathermap.org/img/wn/" + dailyIconCode + "@2x.png"
    let dailyTemp = dailyData.temp.day;
    let dailyWind = dailyData.wind_speed;
    let dailyHumid = dailyData.humidity;
    
    resultForecastEl.innerHTML = `
    <h2 class="text-lg">${days[i-1]}</h2>
    <img class="w-10 h-16 inline-block pb-6" src="${dailyIconURL}" alt="icon_id: ${dailyIconCode}"> 
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
    const geoURL = "https://api.openweathermap.org/geo/1.0/direct?q="+ inputCityString + "&appid=acf279683d77cfa942d0855d6b194227"
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