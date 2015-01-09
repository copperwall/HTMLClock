var id = 'current_time';
var element = document.getElementById(id);
// Weather API Key
var key = '5ed5655b09100ec7ed50fd35e66610f9';

/**
 * Get time, add to element, call self in a setTimeout
 */
function getTime() {
   var time = (new Date()).toLocaleTimeString(undefined, {hour12: false});
   element.innerHTML = time;

   setTimeout(getTime, 1000);
}

function getTemp(coordinates) {
   var location = coordinates ? coordinates.join(',') : '35.300399,-120.662362';
   var url = 'https://api.forecast.io/forecast/' + key + '/' + location + '?callback=?';
   var day = (new Date()).getDay();

   // Grab weather data and update page.
   $.getJSON(url).done(function(data) {
      $('#forecastLabel').html(data.daily.summary);
      $('#forecastIcon').attr('src', 'img/' + data.daily.icon + '.png');
      $('body').removeClass().addClass(getColorByTemp(data.daily.data[day]));
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

getTime();
getTemp();
