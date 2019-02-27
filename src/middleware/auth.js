import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_SCOPE } from '../utils/client/google';


let GoogleAuth = '';

const handleAuthClick = (auth) => {
  if(auth.isSignedIn.get()) {
    console.log("Signed In to Google!");
  }
  else {
    auth.signIn();
  }
}

export const authBeginMiddleware = store => next => action => {
  if(action.type === 'BEGIN_GOOGLE_AUTH') {
    window.gapi.load('client:auth2', {
      callback: () => {
        window.gapi.client.init({
            'apiKey': GOOGLE_API_KEY,
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
              })
            } else {
              next({
                type: 'FAIL_GOOGLE_AUTH',
              })
            }
        })
      }
    });
  }
  return next(action);
}

export const authSuccessMiddleware = store => next => action => {
  if(action.type === 'SUCCESS_GOOGLE_AUTH') {
    next({
      type: 'RETRIEVE_STORED_EVENTS'
    })
  }
  if(action.type === 'FAIL_GOOGLE_AUTH') {
    //re
    next({
      type: 'RETRY_GOOGLE_AUTH'
    })
  }
  return next(action);
}
