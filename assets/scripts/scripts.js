let cityList = [];
let cityName = "Austin";
let apiKey = "&appid=ca0256bec5e85ccf80053fd125653cba";

function getWeather(cityName) {
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    let date = new Date();
    $("#city").text(response.name);
    $("#date").text((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
    $("#weather-icon").html("<img src=\"http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png\">");
    $("#temperature__data").text(((response.main.temp) * (9/5) - 459.67).toFixed(2) + " °F");
    $("#humidity__data").text(response.main.humidity + "%");
    $("#wind-speed__data").text(response.wind.speed + " MPH");

    let lat = response.coord.lat;
    let long = response.coord.lon;

    let getUV = "http://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + long + apiKey;

    $.ajax({
      url: getUV,
      method: "GET"
    }).then(function(response) {
      $("#uv-index__data") = response.value;
    });
  });
}

function getForecast(cityName) {
  let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $("#cardList").text("");
    for (let i = 0; i < 5; i++) {
      let dayValue = i * 8;
      let dateFormat = response.list[dayValue].dt_txt.split(/[- ]/);
      let date = dateFormat[1] + "/" + dateFormat[2] + "/" + dateFormat[0];
      let icon = "<img src=\"http://openweathermap.org/img/wn/" + response.list[dayValue].weather[0].icon + ".png\">";
      let temp = (response.list[dayValue].main.temp * (9/5) - 459.57).toFixed(2);
      let humidity = response.list[dayValue].main.humidity;

      $("#cardList").append(
        `<div class="day-card">
          <h3>${date}</h3>
          <div>${icon}</div>
          <div>Temp: ${temp} °F</div>
          <div>Humidity: ${humidity}%</div>
        </div>`
      )
    }
  });
}

function addCity() {
  $("#city-list").text("");
  let cityListLocal = localStorage.getItem("cityList").split(",");
  cityList = cityListLocal;
  for (let i = 0; i < cityList.length; i++) {
    $("#city-list").append("<li><button type=\"button\" class=\"city-button\" id=\"cityButton\">" + cityList[i] + "</button></a>");
  }
}

$("#searchButton").click(function() {
  if ($("#searchInput").val().trim() != "") {
    cityList.push($("#searchInput").val());
    localStorage.setItem("cityList", cityList);
    addCity();
  }
});

$("#searchInput").keypress(function(event) {
  if (event.which === 13) {
    $("#searchButton").click();
  }
});

$(document).on("click", "#cityButton", function() {
  cityName = $(this).text();
  getWeather(cityName);
  getForecast(cityName);
});



getWeather(cityName);
getForecast(cityName);
addCity();