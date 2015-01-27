var id = 'current_time';
var element = document.getElementById(id);

/**
 * Get time, add to element, call self in a setTimeout
 */
function getTime() {
   var time = (new Date()).toLocaleTimeString();
   element.innerHTML = time;

   setTimeout(getTime, 1000);
}

getTime();
