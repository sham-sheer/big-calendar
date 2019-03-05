import { GET_EVENTS_BEGIN,
  POST_EVENT_BEGIN,
  getEventsSuccess,
  postEventSuccess,
  DELETE_EVENT_BEGIN,
  GET_OUTLOOK_EVENTS_BEGIN, 
  CLEAR_ALL_EVENTS,
} from '../actions/events';
import { duplicateAction } from '../actions/db/events';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { normalize, schema } from 'normalizr';
import { loadClient,
  loadFullCalendar,
  loadSyncCalendar,
  loadNextPage,
  postGoogleEvent,
  deleteGoogleEvent
} from '../utils/client/google';
import { Client } from "@microsoft/microsoft-graph-client";
import { PageIterator } from "@microsoft/microsoft-graph-client/lib/src/tasks/PageIterator";
import * as Providers from '../utils/constants'; 

import db from '../db/index';
import * as RxDB from 'rxdb';

export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
  mergeMap(() => from(loadClient()).pipe(
    mergeMap(() => from(setCalendarRequest()).pipe(
      mergeMap(resp => from(eventsPromise(resp)).pipe(
        map((resp) => {
          return getEventsSuccess(resp,Providers.GOOGLE);
        })
      )
      )
    )
    )
  )
  )
);

export const beginPostEventEpics = action$ => action$.pipe(
  ofType(POST_EVENT_BEGIN),
  mergeMap(action => from(postEvent(action.payload)).pipe(
    map(resp => postEventSuccess([resp.result]))
  )
  )
);

const postEvent = async (resource) => {
  let calendarObject = {
    'calendarId': 'primary',
    'resource': resource
  };
  await loadClient();
  return postGoogleEvent(calendarObject);
};

const deleteEvent = async (id) => {
  await loadClient();
  return deleteGoogleEvent(id);
};

const setCalendarRequest = () => {
  let request;
  let syncToken = localStorage.getItem('sync');
  if(syncToken == null) {
    console.log("Performing full sync");
    request = loadFullCalendar();
  } else {
    console.log("Performing incremental sync");
    request = loadSyncCalendar(syncToken);
  }
  return request;
};

const normalizeEvents = (response) => {
  let singleEvent = new schema.Entity('events');
  let results = normalize({ events : response}, { events: [ singleEvent ]});
  return results;
};

const eventsPromise = async (resp) => {
  const items = [];
  return new Promise((resolve, reject) => {
    fetchEvents(resp, items, resolve, reject);
  });
};

const fetchEvents = (resp, items, resolve, reject) => {
  const newItems = items.concat(resp.result.items);
  if(resp.result.nextPageToken !== undefined) {
    loadNextPage(resp.result.nextPageToken).then(nextResp => {
      return fetchEvents(nextResp, newItems, resolve, reject);
    }).catch(e => {
      if(e.code === 410) {
        console.log('Invalid sync token, clearing event store and re-syncing.');
        localStorage.deleteItem('sync');
        loadFullCalendar()
          .then(newResp => fetchEvents(newResp, items, resolve, reject));
      } else {
        console.log(e);
        reject('Something went wrong, Please refresh and try again');
      }
    });
  } else {
    localStorage.setItem('sync', resp.result.nextSyncToken);
    resolve(newItems);
  }
};

// ------------------------------------ OUTLOOK ------------------------------------ //

function getAccessToken(callback) {
  var now = new Date().getTime();
  var isExpired = now > parseInt(window.localStorage.getItem('outlook_expiry'));
  // Do we have a token already?
  if (window.localStorage.getItem('outlook_access_token') && !isExpired) {
    // Just return what we have
    if (callback) {
      callback(window.localStorage.getItem('outlook_access_token'));
    }
  } else {
    // Attempt to do a hidden iframe request
    // makeSilentTokenRequest(callback);
    console.log("Access token expired!!");
  }
}

function getUserEvents(callback) {
  getAccessToken(function(accessToken) {
    if (accessToken) {
      // Create a Graph client
      var client = Client.init({
        authProvider: (done) => {
          // Just return the token
          done(null, accessToken);
        }
      });

      var id = "";
      
      // This first select is to choose from the list of calendars 
      client
        .api('/me/calendars')
        .get(async (err, res) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(res);
            // We are hard coding to select from keith's calendar first. but change this for production. LOL
            // By default, can use 0 coz should have a default calendar. 
            id = res.value[3].id;

            var allEvents = await loadOutlookEventsChunked(client, id);
            callback(allEvents);
          }
        });
    } else {
      var error = { responseText: 'Could not retrieve access token' };
      callback(null, error);
    }
  });
}

async function loadOutlookEventsChunked (client, id) {
  var allEvents = [];

  try {
    // Makes request to fetch mails list. Which is expected to have multiple pages of data.
    let response = await client
      .api(`/me/calendars/${id}/events`)
      .count(true)
      .top(100)
      .select('attendees, bodyPreview, changeKey, createdDateTime, end, iCalUId, id, isAllDay, organizer, lastModifiedDateTime, location, originalEndTimeZone, originalStart, originalStartTimeZone, recurrence, responseStatus, start, subject, webLink')
      .orderby('createdDateTime DESC')
      .get();

    // Creating a new page iterator instance with client a graph client instance, page collection response from request and callback
    let pageIterator = new PageIterator(client, response, (data) => {
      allEvents.push(data);

      if(allEvents.length !== response['@odata.count']){
        return true; 
      }
      return false;
    });
    
    // This iterates the collection until the nextLink is drained out.
    // Wait till all the iterator are done
    await pageIterator.iterate();
    return allEvents;
  } catch (e) {
    throw e;
  }
}

export const beginGetOutlookEventsEpics = action$ => action$.pipe(
  ofType(GET_OUTLOOK_EVENTS_BEGIN),
  mergeMap(() => from(new Promise((resolve, reject) => {
    getUserEvents((events, error) => {
      resolve(events);
    });
  })).pipe(
    map((resp) => {
      return getEventsSuccess(resp, Providers.OUTLOOK);
    })
  )
  )
);
// ------------------------------------ OUTLOOK ------------------------------------ //


// ------------------------------------ GENERAL ------------------------------------ //
export const clearAllEventsEpics = action$ => action$.pipe(
  ofType(CLEAR_ALL_EVENTS),
  map(() => {
    localStorage.clear();
    RxDB.removeDatabase('eventsdb', 'idb');
  })
);
// ------------------------------------ GENERAL ------------------------------------ //
