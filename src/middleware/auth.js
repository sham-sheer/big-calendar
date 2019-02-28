import { API_KEY, GOOGLE_CLIENT_ID, GOOGLE_SCOPE } from '../utils/google';

import { buildAuthUrl,PopupCenter } from '../utils/outlook';
import * as AuthActionTypes from '../actions/auth';

let GoogleAuth = '';

const handleAuthClick = (auth) => {
  if(auth.isSignedIn.get()) {
    console.log("Signed In to Google!");
  }
  else {
    auth.signIn();
  }
};

export const authBeginMiddleware = store => next => action => {
  if(action.type === 'BEGIN_GOOGLE_AUTH') {
    window.gapi.load('client:auth2', {
      callback: () => {
        window.gapi.client.init({
          'apiKey': API_KEY,
          'clientId': GOOGLE_CLIENT_ID,
          'scope': GOOGLE_SCOPE,
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(() => {
          GoogleAuth = window.gapi.auth2.getAuthInstance();
          //GoogleAuth.signIn();
          handleAuthClick(GoogleAuth);
          const user = GoogleAuth.currentUser.get();
          const isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPE);
          if(isAuthorized) {
            next({
              type: 'SUCCESS_GOOGLE_AUTH',
              payload: {
                user
              }
            });
          } else {
            next({
              type: 'FAIL_GOOGLE_AUTH',
            });
          }
        });
      }
    });
  } else if (action.type === AuthActionTypes.BEGIN_OUTLOOK_AUTH) {
    const url = buildAuthUrl();
    console.log(url);
    window.open(url,'_self',false);
  }
  return next(action);
};

export const authSuccessMiddleware = store => next => action => {
  if(action.type === 'SUCCESS_GOOGLE_AUTH') {
    next({
      type: 'RETRIEVE_STORED_EVENTS'
    });
  }
  if(action.type === 'FAIL_GOOGLE_AUTH') {
    //re
    next({
      type: 'RETRY_GOOGLE_AUTH'
    });
  }

  if(action.type === AuthActionTypes.SUCCESS_OUTLOOK_AUTH) {
    next({
      type: 'RETRIEVE_STORED_EVENTS'
    });
  }
  if(action.type === AuthActionTypes.FAIL_OUTLOOK_AUTH) {
    next({
      type: AuthActionTypes.RETRY_OUTLOOK_AUTH
    });
  }
  return next(action);
};
