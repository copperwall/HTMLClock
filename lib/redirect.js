function redirect_init() {
   var hash = jsonifyHash();
   var access_token = hash['access_token'];
   localStorage.setItem('token', access_token);
   var parent = window.opener;

   parent.oauth_config.callback_function();
   window.close();
}

function jsonifyHash() {
   var hash_key_value_pairs = window.location.hash.substring(1).split('&');
   var hash_results = {};

   hash_key_value_pairs.forEach(function(hash) {
     var equalsSign = hash.indexOf('=');
     var key = hash.substring(0, equalsSign);
     var value = hash.substring(equalsSign + 1);

     hash_results[key] = value;
   });

   return hash_results;
}

redirect_init();
