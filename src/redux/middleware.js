import { createLogger } from 'redux-logger';
import getDb from '../db';

export const loggerMiddleware = createLogger();


const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;
/* Use later
const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
*/
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

export const fetchEvents = (request, items, resolve, reject) => {
    request.execute((resp) => {
    const newItems = items.concat(resp.result.items);
    let pageToken = resp.nextPageToken;
    let syncToken = resp.nextSyncToken;
    debugger
    if(pageToken !== undefined) {
      var nextRequest = window.gapi.client.calendar.events.list({
        'calendarId' : 'primary',
        'pageToken': pageToken
      });
      fetchEvents(nextRequest, newItems, resolve, reject);
    } else {
      localStorage.setItem('sync', syncToken);
      resolve(newItems);
    }
  }, (error) => {
    if(error.code === 410) {
      console.log('Invalid sync token, clearing event store and re-syncing.');
      localStorage.deleteItem('sync');
      var newRequest = window.gapi.client.calendar.events.list({
        'calendarId' : 'primary',
      });
      fetchEvents(newRequest, items, resolve, reject);
    } else {
      console.log(error);
      reject('Something went wrong, Please refresh and try again');
    }
  });
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

  if(action.type === 'GET_GOOGLE_EVENTS_BEGIN') {
    window.gapi.client.load('calendar', 'v3', function() {
      var request = window.gapi.client.calendar.events.list({
        'calendarId' : 'primary',
      });
      let syncToken = localStorage.getItem('sync');
      if(syncToken == null) {
        console.log("Performing full sync");
      } else {
        console.log("Performing incremental sync");
        request = window.gapi.client.calendar.events.list({
          'calendarId' : 'primary',
          'syncToken': syncToken
        });
      }
      let result = [];
      new Promise((resolve, reject) => {
        fetchEvents(request, result, resolve, reject);
      }).then(response => {
        storeEvents(response);
        next({
          type: 'GET_GOOGLE_EVENTS_SUCCESS',
          payload: {
            data: response
          }
        })
      })
    })
  }

  if(action.type === 'NEXT_GET_GOOGLE_EVENTS') {

  }

  if(action.type === 'LAST_GET_GOOGLE_EVENTS') {

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
        storeEvent(resp);
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

const storeEvent = async singleEvent => {
  const db = await getDb();
  const addedEvent = [];
  //need to preprocess data
  await db.events.upsert({
    'id' : singleEvent.id,
    'end' : singleEvent.end,
    'start': singleEvent.start,
    'summary': singleEvent.summary
  });
  addedEvent.push({
    'id' : singleEvent.id,
    'end' : singleEvent.end,
    'start': singleEvent.start,
    'summary': singleEvent.summary
  });
  return addedEvent;
}

const storeEvents = async events => {
  const db = await getDb();
  const dbEvents = filter(events);
  const addEvents = [];
  //need to preprocess data
  dbEvents.forEach(async (dbEvent) => {
    if(!!dbEvent.summary) {
      await db.events.upsert(dbEvent);
      addEvents.push(dbEvent);
    }
  });
  debugger
  return addEvents;
}

export const filter = (data) => {
    debugger
    const formated_events = data
    .map(eachEvent => {
        return {
          'id' : eachEvent.id,
          'end' : eachEvent.end,
          'start': eachEvent.start,
          'summary': eachEvent.summary
        }
      }
    );
    return formated_events
}


export const dbMiddleware = store => next => action => {
  if(action.type === 'INITIAL_SYNC_EVENTS') {

  }
  return next(action);
}
