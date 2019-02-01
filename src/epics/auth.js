import { BEGIN_GOOGLE_AUTH, BEGIN_GOOGLE_LOAD, successGoogleAuth } from '../redux/actions';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;
const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
const OUTLOOK_SCOPE = 'openid profile Calendars.ReadWrite.Shared';
const PARAMS_URL = `response_type=id_token+token&client_id=${OUTLOOK_CLIENT_ID}
                    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foutlook-redirect
                    &scope=${OUTLOOK_SCOPE}&state=f175f48d-d277-9893-9c8d-dcc2a95ffe16
                    &nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304
                    &response_mode=fragment`;

var GoogleAuth;

export const beginGoogleOldAuthEpic = action$ => action$.ofType(BEGIN_GOOGLE_AUTH)
  .mergeMap(() => {
      window.gapi.load('client:auth2', initClient())
      .map(() => {
        debugger
        GoogleAuth = window.gapi.auth2.getAuthInstance()
        const user = GoogleAuth.currentUser.get();
        const isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPE);
        if(isAuthorized) {
          return successGoogleAuth(user);
        }
      })
      .catch(error => console.log(error))
  })

export const beginGoogleLoadAuthEpic = action$ =>
  action$.pipe(
    ofType(BEGIN_GOOGLE_LOAD),
    mergeMap(() => {
      debugger
      window.gapi.load('client:auth2', initClient);
      return beginGoogleAuthEpic();
    })
  )

export const beginGoogleAuthEpic = action$ =>
  action$.pipe(
    ofType(BEGIN_GOOGLE_AUTH),
    mergeMap(() => {
          debugger
          GoogleAuth = window.gapi.auth2.getAuthInstance()
          const user = GoogleAuth.currentUser.get();
          const isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPE);
          if(isAuthorized) {
            return successGoogleAuth(user);
          }
    })
  );
const initClient = () => {
  debugger
  window.gapi.client.init({
      'apiKey': API_KEY,
      'clientId': GOOGLE_CLIENT_ID,
      'scope': GOOGLE_SCOPE,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  }).then( () => {
      GoogleAuth = window.gapi.auth2.getAuthInstance();
      handleAuthClick();
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
      setSigninStatus();
  })
}

const handleAuthClick = () => {
  if (GoogleAuth.isSignedIn.get()) {
      GoogleAuth.signOut();
  } else {
      GoogleAuth.signIn();
    }
}

const updateSigninStatus = (isSignedIn) => {
  this.setSigninStatus();
}

const setSigninStatus = () => {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPE);
  if (isAuthorized) {
    console.log("Authorized");
    this.props.getGoogleEvents();
  } else {
    console.log("Not authorized");
  }
}
