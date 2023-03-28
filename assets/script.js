
$(window).on('load', function () {
    checkLocalStorage();
});

// API key
var APIKey = "2fcd1afb1e82b6acb910fcb96f7fbb7c";

// open string for city to be entered
var q = "";

// get time
var now = moment();
var currentDate = now.format('MMMM Do YYYY || h:mm a');
$("#currentDay").text(currentDate);

// search city function
$("#search-button").on("click", function (event) {
    event.preventDefault();

    q = $("#city-input").val();
    if (q === '') {
        return alert('Please Enter Valid City Name ! ');
    }
    getWeather(q);

    saveToLocalStorage(q);
});

function convertToC(fahrenheit) {
    var fTempVal = fahrenheit;
    var cTempVal = (fTempVal - 32) * (5 / 9);
    var celcius = Math.round(cTempVal * 10) / 10;
    return celcius;
  }

  // create button for recent searches
  function createRecentSearchBtn(q) {
    var newLi = $("<li>")
    var newBtn = $('<button>');
    newBtn.attr('id', 'extraBtn');
    newBtn.addClass("button is-small recentSearch");
    newBtn.text(q);
    newLi.append(newBtn)
    $("#historyList").prepend(newLi);
    $("#extraBtn").on("click", function () {
        var newQ = $(this).text();
        getWeather(newQ);
    });
}

// get weather function
function getWeather(q) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
        error: (err => {
            alert("City not found.")
            return;
        })
    }).then(function (response) {
        console.log(response)
        $(".cityList").empty()
        $("#days").empty()
        var celcius = convertToC(response.main.temp);
        var cityMain1 = $("<div col-12>").append($("<p><h2>" + response.name + ' (' + currentDate + ')' + "</h2><p>"));
        var image = $('<img class="imgsize">').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');        
        var degreeMain = $('<p>').text('Temperature : ' + response.main.temp + ' °F (' + celcius + '°C)');
        var humidityMain = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var windMain = $('<p>').text('Wind Speed : ' + response.wind.speed + 'MPH');
        var cityId = response.id;

        displayForecast(cityId);

        cityMain1.append(image).append(degreeMain).append(humidityMain).append(windMain);
        $('#cityList').empty();
        $('#cityList').append(cityMain1);
    });
}

// display the forecast
function displayForecast(c) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + c + "&units=imperial&APPID=" + APIKey,
        method: "GET",
    }).then(function (response) {
        var arrayList = response.list;
        for (var i = 0; i < arrayList.length; i++) {
            if (arrayList[i].dt_txt.split(' ')[1] === '12:00:00') {
                console.log(arrayList[i]);
                var celcius = convertToC(arrayList[i].main.temp);
                var cityMain = $('<div>');
                cityMain.addClass('col forecast bg-primary text-white ml-3 mb-3 rounded>');
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp : ' + arrayList[i].main.temp + ' °F ('+ celcius + '°C)');           
                var humidityMain = $('<p>').text('Humidity : ' + arrayList[i].main.humidity + '%');
                var windMain = $('<p>').text('Wind Speed : ' + arrayList[i].wind.speed + 'MPH');                
                cityMain.append(date5).append(image).append(degreeMain).append(humidityMain).append(windMain);
                $('#days').append(cityMain);
            }
        }
    });
};

// set up storage of city search
function checkLocalStorage() {
    var storedData = localStorage.getItem('queries');
    var dataArray = [];
    if (!storedData) {
        console.log("no data stored");
    } else {
        storedData.trim();
        dataArray = storedData.split(',');
        for (var i = 0; i < dataArray.length; i++) {
            createRecentSearchBtn(dataArray[i]);
        }
    }
};

function saveToLocalStorage(q) {
    var data = localStorage.getItem('queries');
    if (data) {
        console.log(data, q)

    } else {
        data = q;
        localStorage.setItem('queries', data);
    }
    if (data.indexOf(q) === -1) {
        data = data + ',' + q;
        localStorage.setItem('queries', data);
        createRecentSearchBtn(q);
    }
}

$("#clear-history").on("click", function (event) {
    $("#historyList").empty();
});