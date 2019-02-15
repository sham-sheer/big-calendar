import { createLogger } from 'redux-logger';
import getDb from '../db';
import md5 from 'md5';
import { normalize, schema } from 'normalizr';

export const loggerMiddleware = createLogger();

export const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
export const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
export const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;


const MicrosoftGraph = require("@microsoft/microsoft-graph-client");


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

export const fetchCalendarList = (request, calendarList, resolve, reject) => {
  request.execute((resp) => {
    const newList = calendarList.concat(resp.result.items);
    let pageToken = resp.nextPageToken;
    if(pageToken !== undefined) {
      var nextRequest = window.gapi.client.calendar.calendarList.list({
        'pageToken': pageToken
      })
      fetchEvents(nextRequest, newList, resolve, reject);
    } else {
      resolve(calendarList);
    }
  }, (error) => {
    console.log(error);
  })
}

export const fetchEvents = (request, items, resolve, reject) => {
    request.execute((resp) => {
    const newItems = items.concat(resp.result.items);
    let pageToken = resp.nextPageToken;
    let syncToken = resp.nextSyncToken;
    //debugger
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
      }).then(async response => {
          let results = await storeEvents(response);
          const myData = { events : results};
          const singleEvent = new schema.Entity('events');
          const mySchema = { events: [ singleEvent ]};
          const normalizedResults = normalize(myData, mySchema);
          next({
            type: 'GET_GOOGLE_EVENTS_SUCCESS',
            payload: {
              data: results,
              normalized_data: normalizedResults
            }
          })
        });
    })
  }

  if(action.type === 'GET_GOOGLE_CALENDAR_LIST_BEGIN') {
    let pageToken = null
    let calendarList = [];
    window.gapi.client.load('calendar', 'v3', function() {
      var request = window.gapi.client.calendar.calendarList.list({
        'pageToken': pageToken
      })
      new Promise((resolve, reject) => {
        fetchCalendarList(request, calendarList, resolve, reject);
      }).then(async response => {
        console.log(response)
      })
    })


  }

  if(action.type === 'NEXT_GET_GOOGLE_EVENTS') {

  }

  if(action.type === 'LAST_GET_GOOGLE_EVENTS') {

  }

  if(action.type === 'POST_GOOGLE_EVENT') {
    let calendarObject = {
        'calendarId': 'primary',
        'resource': action.payload
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
    /*const value = outlookCalendarEvents();
    next({
      type: action.type + '_SUCCESS',
      payload: {
        data: value
      }
    })*/
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

async function storeEvents(events){
  const db = await getDb();
  const dbEvents = filter(events);
  const addEvents = [];
  //need to preprocess data
  const results = dbEvents.map(async dbEvent => {
    if(!!dbEvent.id) {
      try {
        await db.events.upsert(dbEvent);
      } catch(e) {
        console.log(e);
      }
      return dbEvent;
    }
  });
  let values = await Promise.all(results);
  return values;
}

export const filter = (data) => {
  //debugger
    const formated_events = data
    .map(eachEvent => {
        return  ({
          'id' : md5(eachEvent.id),
          'end' : eachEvent.end,
          'start': eachEvent.start,
          'summary': eachEvent.summary,
          'organizer': eachEvent.organizer,
          'recurrence': eachEvent.recurrence,
          'iCalUID': eachEvent.iCalUID,
          'attendees': eachEvent.attendees
        })
      }
    );
    return formated_events
}


export const dbMiddleware = store => next => action => {
  if(action.type === 'INITIAL_SYNC_EVENTS') {
  }
  return next(action);
}
