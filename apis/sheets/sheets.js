// Client ID and API key from the Developer Console
var CLIENT_ID = '369962214050-qv2v67bd272rg9ln2ukfnktdbfn8t3f7.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqbTX_QVV5ROL-85oogpPWO0skBUDMAoo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
var col_count=0;
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var insertSubmit=document.getElementById('insert_submit');
var responseDiv=document.getElementById('view_page');
var insertDIv=document.getElementById('add_page');
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
    responseDiv.style.display = 'block';
    insertDIv.style.display = 'block';
    getResult();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    responseDiv.style.display ='none';
    insertDIv.style.display = 'none';
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
  col_count=0;
  // var cv_image=document.getElementById('cv_image').value;
  // var cv_type=document.getElementById('cv_type').value;
  gapi.client.sheets.spreadsheets.values.get({
    // 'requests': {
    'spreadsheetId':'1sVCd8Iz2m8dZgQMvrm7nGZ1bx23KX_6sLkAAt4A19EU',
    'range': 'Sheet1!A1:ZZ100'
    // }
  }).then(function(response) {
    var values=response.result.values;
    var table_string="<table border='1' width='100%'>";
    var insert_string="";
    var row_count=0;
    values.forEach(function (row) {
      row_count++;
      table_string+="<tr>";
      row.forEach(function (val) {
        if(row_count==1){
          col_count++;
          table_string+="<th>"+val+"</th>";
        }else{
          table_string+="<td>"+val+"</td>";
        }

      })
      table_string+="</tr>"
    });
    table_string+="</table>";
    document.getElementById('response').innerHTML=table_string;

    for(var i=1;i<=col_count;i++){
      insert_string+="<input type='text' class='insert_texts' placeholder='Value for Column "+i+"'/><br><br>";
    }
    document.getElementById('insertion').innerHTML=insert_string;
  });
}
function insertValues() {
  var texts= document.getElementsByClassName('insert_texts');
  var values=Array();
  for(var i=0;i<col_count;i++){
    values.push(texts[i].value);
  }
console.log(values);
  gapi.client.sheets.spreadsheets.values.append({
    'spreadsheetId':'1sVCd8Iz2m8dZgQMvrm7nGZ1bx23KX_6sLkAAt4A19EU',
    "range": "Sheet1!A1:ZZ100",
    "valueInputOption": "USER_ENTERED",
    "values": [
      values
    ],
  }).then(function(response) {
    console.log(response);
    getResult();
  });
}
