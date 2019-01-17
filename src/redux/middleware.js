import { createLogger } from 'redux-logger';

export const loggerMiddleware = createLogger();

const CALENDAR_ID = 'shamsheer619@gmail.com';
const CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const SCOPE = `https://www.googleapis.com/auth/calendar.events`;
var GoogleAuth;


function initClient() {
  window.gapi.client.init({
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPE,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = window.gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);


      // Handle initial sign-in state. (Determine if user is already signed in)
      var user = GoogleAuth.currentUser.get();
      GoogleAuth.signIn();
  })
}



function revokeAccess() {
  GoogleAuth.disconnect();
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
  } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    console.log("Authorized");
  } else {
    console.log("Not authorized");
  }
}

const pageToken = null;

function makeApiCall() {
  var request = window.gapi.client.request({
    'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
  });

// Execute the API request.
  request.execute(function(response) {
    console.log(response);
  });
}


function handleClientLoad() {
  window.gapi.load('client:auth2', initClient);
}

export const apiMiddleware = store => next => action => {
  if(action.type === 'GET_EVENTS') {

    // Not complete
    handleClientLoad();
  }
  return next(action);
}
