import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_SCOPE, filterUser } from '../utils/client/google';
import { buildAuthUrl } from '../utils/client/outlook';

import * as Providers from '../utils/constants'; 
import getDb from '../db';

import * as AuthActionTypes from '../actions/auth';
import * as DbActionTypes from '../actions/db/events';

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
  if(action === undefined) {
    console.log("Action undefined, returning and doing nothing.");
    return;
  }

  if(action.type === AuthActionTypes.BEGIN_GOOGLE_AUTH) {
    GoogleAuth = window.gapi.auth2.getAuthInstance();
    //GoogleAuth.signIn();
    handleAuthClick(GoogleAuth);
    const googleUser = GoogleAuth.currentUser.get();
    const authResponse = googleUser.getAuthResponse();
    const user = filterUser(googleUser.getBasicProfile(), authResponse.access_token, authResponse.expires_at);
  
    const isAuthorized = googleUser.hasGrantedScopes(GOOGLE_SCOPE);
    if(isAuthorized) {
      next({
        type: AuthActionTypes.SUCCESS_GOOGLE_AUTH,
        payload: {
          user
        }
      });
    } else {
      next({
        type: AuthActionTypes.FAIL_GOOGLE_AUTH,
      });
    }
    // window.gapi.load('client:auth2', {
    //   callback: () => {
    //     window.gapi.client.init({
    //       'apiKey': GOOGLE_API_KEY,
    //       'clientId': GOOGLE_CLIENT_ID,
    //       'scope': GOOGLE_SCOPE,
    //       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    //     });
    //   }
    // }););

    // window.gapi.load('client:auth2', {
    //   callback: () => {
    //     window.gapi.client.init({
    //       'apiKey': GOOGLE_API_KEY,
    //       'clientId': GOOGLE_CLIENT_ID,
    //       'scope': GOOGLE_SCOPE,
    //       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    //     }).then(async () => {
    //       GoogleAuth = window.gapi.auth2.getAuthInstance();
    //       //GoogleAuth.signIn();
    //       handleAuthClick(GoogleAuth);
    //       const googleUser = GoogleAuth.currentUser.get();
    //       const authResponse = googleUser.getAuthResponse();

    //       const db = await getDb();
    //       const user = filterUser(googleUser.getBasicProfile(), authResponse.access_token, authResponse.expires_at);
    //       console.log(user);
    //       // db.provider_users.find().exec().then(document => console.log(document));
    //       db.provider_users.upsert(user);

    //       const isAuthorized = googleUser.hasGrantedScopes(GOOGLE_SCOPE);
    //       if(isAuthorized) {
    //         next({
    //           type: AuthActionTypes.SUCCESS_GOOGLE_AUTH,
    //           payload: {
    //             user
    //           }
    //         });
    //       } else {
    //         next({
    //           type: AuthActionTypes.FAIL_GOOGLE_AUTH,
    //         });
    //       }
    //     });
    //   }
    // });
    
    // GoogleAuth = window.gapi.auth2.getAuthInstance();
    // //GoogleAuth.signIn();
    // handleAuthClick(GoogleAuth);
    // const googleUser = GoogleAuth.currentUser.get();
    // const authResponse = googleUser.getAuthResponse();
    // const user = filterUser(googleUser.getBasicProfile(), authResponse.access_token, authResponse.expires_at);

    // // const db = await getDb();
    // // const user = filterUser(googleUser.getBasicProfile(), authResponse.access_token, authResponse.expires_at);
    // // console.log(user);
    // // // db.provider_users.find().exec().then(document => console.log(document));
    // // db.provider_users.upsert(user);

    // const isAuthorized = googleUser.hasGrantedScopes(GOOGLE_SCOPE);
    // if(isAuthorized) {
    //   next({
    //     type: AuthActionTypes.SUCCESS_GOOGLE_AUTH,
    //     payload: {
    //       user
    //     }
    //   });
    // } else {
    //   next({
    //     type: AuthActionTypes.FAIL_GOOGLE_AUTH,
    //   });
    // }
    // // window.gapi.load('client:auth2', {
    // //   callback: () => {
    // //     window.gapi.client.init({
    // //       'apiKey': GOOGLE_API_KEY,
    // //       'clientId': GOOGLE_CLIENT_ID,
    // //       'scope': GOOGLE_SCOPE,
    // //       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    // //     });
    // //   }
    // // });
  } else if (action.type === AuthActionTypes.BEGIN_OUTLOOK_AUTH) {
    const url = buildAuthUrl();
    window.open(url,'_self',false);
  }
  return next(action);
};

export const authSuccessMiddleware = store => next => action => {
  if(action.type === AuthActionTypes.SUCCESS_GOOGLE_AUTH) {
    next({
      type: DbActionTypes.RETRIEVE_STORED_EVENTS,
      providerType: Providers.GOOGLE,
    });
  }
  if(action.type === AuthActionTypes.FAIL_GOOGLE_AUTH) {
    next({
      type: AuthActionTypes.RETRY_GOOGLE_AUTH
    });
  }

  if(action.type === AuthActionTypes.SUCCESS_OUTLOOK_AUTH) {
    next({
      type: DbActionTypes.RETRIEVE_STORED_EVENTS,
      providerType: Providers.OUTLOOK,
    });
  }
  if(action.type === AuthActionTypes.FAIL_OUTLOOK_AUTH) {
    next({
      type: AuthActionTypes.RETRY_OUTLOOK_AUTH
    });
  }
  return next(action);
};
