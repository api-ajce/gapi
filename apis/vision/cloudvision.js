// Client ID and API key from the Developer Console
var CLIENT_ID = '369962214050-qv2v67bd272rg9ln2ukfnktdbfn8t3f7.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqbTX_QVV5ROL-85oogpPWO0skBUDMAoo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/vision/v1/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/cloud-vision";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var cv_form = document.getElementById('cv_form');
var cv_response = document.getElementById('cv_response');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}


/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    cv_form.style.display='block';
    cv_response.style.display='block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    cv_form.style.display='none';
    cv_response.style.display='none';

  }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


/**
* Print the display name if available for 10 connections.
*/
function getResult() {
  var cv_image=document.getElementById('cv_image').value;
  var cv_type=document.getElementById('cv_type').value;
  gapi.client.vision.images.annotate({
    'requests': [{
      'image': {
        'content': cv_image
      },
      'features': [{
        'type': cv_type,
        'maxResults': 200
      }]
    }]
  }).then(function(response) {
    document.getElementById('cv_result').innerHTML=JSON.stringify(response);
    });
  }
