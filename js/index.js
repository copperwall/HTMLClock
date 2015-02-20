// Weather API Key
var weatherKey = '5ed5655b09100ec7ed50fd35e66610f9';
var geoKey = 'e57353dc23074f0eb30c484ee21f3d47';

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
   var url = 'https://api.forecast.io/forecast/' + weatherKey + '/' + location + '?callback=?';
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
      reverseGeocode(coordinates);
      $('#geolocation').show();
      $('#coords').html(coordinates.join(', '));
   },
   function(error) {
      $('#geolocation').html(error.message + ' :(');
      $('#geolocation').show();
   });
}

function reverseGeocode(coordinates) {
   var url = "http://geoservices.tamu.edu/Services/ReverseGeocoding/WebService/v04_01/Rest/";
   var lat = coordinates[0];
   var long= coordinates[1];
   url += '?apiKey=' + geoKey + '&version=4.01&lat=' + lat + '&lon=' + long + '&format=json';

   $.getJSON(url).done(function(data) {
      $('#city').html(data["StreetAddresses"][0]["City"]);
   });
}

// Alarm functions 

function showAlarmPopup() {
   $('#mask, #popup').removeClass('hide');
}

function hideAlarmPopup() {
   $('#mask, #popup').addClass('hide');
}

function insertAlarm(hours, mins, ampm, alarmName) {
   var wat = $('<div>').addClass('flexable');
   wat.append('<div class="name">' + alarmName + '</div>');
   wat.append('<div class="time">' + hours + ':' + mins + ' ' + ampm + '</div>');
   wat.append('<button style="float: right;" name="' + alarmName + '" class="delete">Delete</button>');
   $('#alarms').append(wat);

   wat.click(function(elem) {
      // Visually remove alarm
      // Remove from parse
      deleteAlarm(alarmName);
   });
}

function addAlarm() {
   var hours, mins, ampm, alarmName;
   var username = getUserName();

   var params = ['hours', 'mins', 'ampm'].map(function(selector) {
      return $('#' + selector + ' option:selected').text();
   });

   params.push($('#alarmName').val());

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();

   alarmObject.save({"username": username, "hours": params[0], "mins": params[1], "ampm": params[2], "alarmName": params[3]}, {
      success: function(object) {
         insertAlarm.apply(this, params);
         hideAlarmPopup();
      }
   });
}

function deleteAlarm(alarmName) {
   $('button[name="' + alarmName + '"]').parent().remove();
   var username = getUserName();

   // Now Parse
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.equalTo('username', username);
   query.equalTo('alarmName', alarmName);
   query.first({
      success: function(result) {
         result.destroy();
      }
   });
}

function populateSelectors() {
   for (var i = 1; i <= 12; i++) {
      if (i < 10)
         i = '0' + i;
      $('#hours').append('<option>' + i + '</option>');
   }

   for (var i = 0; i <= 60; i++) {
      if (i < 10)
         i = '0' + i;
      $('#mins').append('<option>' + i + '</option>');
   }
}

function getAllAlarms(username) {
   Parse.initialize("FwU0sa1EGfhSB9X0mSCO6gxxLkGp79X4XmHafYyd", "k3eDx06lCtPuNPLG5sE3NupDXUAf2X8iY5IZMvmp");

   var username = getUserName();
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.equalTo('username', username);
   query.find({
     success: function(results) {
         results.forEach(function(result) {
            insertAlarm(result.get("hours"), result.get("mins"), result.get("ampm"), result.get("alarmName"));
         });
      }
   });
}

populateSelectors();
getTime();
getCoordinates();
getTemp();
