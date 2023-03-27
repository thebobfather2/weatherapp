
$(window).on('load', function () {
    currentLocation();
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
    });
}