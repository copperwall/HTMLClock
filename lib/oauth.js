// Run on page load
var imgur_url = 'https://api.imgur.com/oauth2/authorize';
var oauth_config = {
   'client_id': 'e4c8787205a3b57',
   'response_type': 'token',
   'state': 'lel',
   'callback_function': getMe
}

function init(auth) {
}

// Run when sign in button is clicked. Send request to 
function login() {
   var child_win = window.open(make_url());
}

function make_url() {
   var url = imgur_url + '?';
   
   url += ['client_id', 'response_type', 'state'].reduce(function(prev, current, index) {
      return prev + current + '=' + oauth_config[current] + '&';
   }, "");

   // Trim last '&'
   return url.substring(0, url.length -1);
}

function getMe() {
   var url = 'https://api.imgur.com/3/account/me';
   var settings = {
      'headers': {
         'Authorization': 'Client-ID ' + oauth_config.client_id,
         'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
   };
   $.ajax(url, settings).done(function(data) {
      var username = data.data.url;
      alert('Your username is ' + username + '!');
   });
}

$('#login_link').click(login);

init(oauth_config);
