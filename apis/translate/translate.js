function start() {
  var text=document.getElementById('text').value;
  var t_lang=document.getElementById('target_lang').value;
  gapi.client.init({
    'apiKey': 'AIzaSyBqbTX_QVV5ROL-85oogpPWO0skBUDMAoo',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
  }).then(function() {
    return gapi.client.language.translations.list({
      q: text,
      source: 'en',
      target: t_lang,
    });
  }).then(function(response) {
    document.getElementById('results').innerHTML=response.result.data.translations[0].translatedText;
    // console.log(response.result.data.translations[0].translatedText);
  }, function(reason) {
    document.getElementById('results').innerHTML="Currently not available.!";
    console.log('Error: ' + reason.result.error.message);
  });
};
