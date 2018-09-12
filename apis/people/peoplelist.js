// Client ID and API key from the Developer Console
var CLIENT_ID = '369962214050-qv2v67bd272rg9ln2ukfnktdbfn8t3f7.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqbTX_QVV5ROL-85oogpPWO0skBUDMAoo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/contacts";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var contactadd = document.getElementById('contactadd');
var contactlist = document.getElementById('contactlist');

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

function CreateContact() {
  var name = document.getElementById('contact-name').value;
  var phone = document.getElementById('contact-phone').value;
  var cphone=phone.charAt(0)=='+'?phone:'+91'+phone;
    gapi.client.people.people.createContact({
        parent: 'people/me',
        'resource': {
          'names': [{
            'givenName':name,
            'displayNameLastFirst':name,
            'displayName': name
          }],
          'phoneNumbers': [{
            'value': phone,
            'canonicalForm':cphone
          }]
        }
    }).then(function(response) {
      alert("Contact Saved");
      clearList();
      listConnectionNames();
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
    contactadd.style.display='block';
    contactlist.style.display='block';
    listConnectionNames();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    contactadd.style.display='none';
    contactlist.style.display='none';

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

function clearList() {
    var pre = document.getElementById('content');
    pre.innerHTML="";
}
/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
* Print the display name if available for 10 connections.
*/
function listConnectionNames() {
  gapi.client.people.people.connections.list({
    'resourceName': 'people/me',
    'pageSize': 300,
    'personFields': 'names,phoneNumbers',
  }).then(function(response) {
    var connections = response.result.connections;
    connections.forEach(function (person) {
      if(person.names && person.names.length > 0){
        appendPre(person.names[0].displayName+
          " - "+
          person.phoneNumbers[0].canonicalForm);
        }
      });
    });
  }
