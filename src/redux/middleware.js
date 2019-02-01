import { createLogger } from 'redux-logger';
import getDb from '../db';

export const loggerMiddleware = createLogger();


const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;
const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
let GoogleAuth;

function outlookCalendarEvents() {
  return MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, window.localStorage.getItem('at'))
    }
  }).api('/me/events')
    .top(10)
    .select('subject,start,end,createdDatetime')
    .orderby('createdDatetime DESC')
    .get((err, res) => {
      if (err) {
        return err;
      } else {
        return res.value;
      }
    });
}

function handleAuthClick(auth) {
  if(auth.isSignedIn.get()) {
    console.log("Signed In to Google!");
  }
  else {
    auth.signIn();
  }
}

export const apiMiddleware = store => next => action => {
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
              })
            }
        })
      }
    });
  }

  if(action.type === 'GET_GOOGLE_EVENTS') {
    window.gapi.client.request({
         'path': `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
       }).then(resp => {
       let events = resp.result.items;
       next({
         type: action.type + '_SUCCESS',
         payload: {
           data: events
         }
       });
     }, (reason) => {
       next({
         type: action.type + '_FAILURE',
         payload: {
           data: reason
         }
       });
     });
  }

  if(action.type === 'POST_GOOGLE_EVENT') {
    var calendarObject =
    {
        'calendarId': 'primary',
        'resource': action.payload.event
    };

    //deprecated function: take note
    window.gapi.client.load('calendar', 'v3', function() {
      var request = window.gapi.client.calendar.events.insert(calendarObject);
      request.execute(function(resp) {
          next({
            type: action.type + '_SUCCESS',
            payload: {
              data: resp
            }
          })
      });
    })
  }
  if(action.type === 'GET_OUTLOOK_EVENTS') {
    const value = outlookCalendarEvents();
    next({
      type: action.type + '_SUCCESS',
      payload: {
        data: value
      }
    })
  }
  return next(action);
}

const saveEvents = async events => {
  const db = await getDb();
  const dbEvents = [];
}


export const dbMiddleware = store => next => action => {
  if(action.type === 'GET_GOOGLE_EVENTS_SUCCESS') {
    debugger
    saveEvents(action.payload);
  }
  return next(action);
}
