// Weather API Key
var key = '5ed5655b09100ec7ed50fd35e66610f9';

/**
 * Get time, add to element, call self in a setTimeout
 */
function getTime() {
   var time = (new Date()).toLocaleTimeString();
   $('#current_time').html(time);

   setTimeout(getTime, 1000);
}

/**
 * Get weather data based on provided coordinates. If no coordinates are given, use
 * the CSL's coordinates.
 */
function getTemp(coordinates) {
   var location = coordinates ? coordinates.join(',') : '35.300399,-120.662362';
   var url = 'https://api.forecast.io/forecast/' + key + '/' + location + '?callback=?';
   var day = (new Date()).getDay();

   // Grab weather data and update page when done.
   $.getJSON(url).done(function(data) {
      var summary = data.daily.summary;
      var icon = data.daily.icon;
      var dailyMaxTemp = data.daily.data[day].temperatureMax;

      $('#forecastLabel').html(summary);
      $('#forecastIcon').attr('src', 'img/' + icon + '.png');
      $('body').removeClass().addClass(getColorByTemp(dailyMaxTemp));
   });
}

function getColorByTemp(temp) {
   if (temp <= 60)
      return 'cold';
   if (temp < 70)
      return 'chilly';
   if (temp < 80)
      return 'nice';
   if (temp < 90)
      return 'warm';
   return 'hot';
}

/**
 * If user shares location, get weather information for user's coordinates.
 */
function getCoordinates() {
   navigator.geolocation.getCurrentPosition(function(position) {
      var coordinates = [position.coords.latitude, position.coords.longitude];

      getTemp(coordinates);
      $('#geolocation').show();
      $('#coords').html(coordinates.join(', '));
   },
   function(error) {
      $('#geolocation').html(error.message + ' :(');
      $('#geolocation').show();
   });
}

getTime();
getCoordinates();
getTemp();
