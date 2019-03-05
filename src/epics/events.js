import { GET_EVENTS_BEGIN, GET_OUTLOOK_EVENTS_BEGIN,getEventsSuccess } from '../actions/events';
import { duplicateAction } from '../actions/db/events';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { normalize, schema } from 'normalizr';
import { loadClient,
  loadFullCalendar,
  loadSyncCalendar,
  loadNextPage
} from '../utils/client/google';
import { Client } from "@microsoft/microsoft-graph-client";

export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
  mergeMap(() => from(loadClient()).pipe(
    mergeMap(() => from(setCalendarRequest()).pipe(
      mergeMap(resp => from(eventsPromise(resp)).pipe(
        map((resp) => {
          return getEventsSuccess(resp,'GOOGLE');
        })
      )
      )
    )
    )
  )
  )
);

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

      // #TO-DO Figure out how to do pagination instead for future
      client
        .api('/me/events')
        .top(10)
        // .select('*')
        .select('attendees, bodyPreview, changeKey, createdDateTime, end, iCalUId, id, isAllDay, organizer, lastModifiedDateTime, location, originalEndTimeZone, originalStart, originalStartTimeZone, recurrence, responseStatus, start, subject, webLink')
        .orderby('createdDateTime DESC')
        .get((err, res) => {
          if (err) {
            callback(null, err);
          } else {
            callback(res.value);
          }
        });
    } else {
      var error = { responseText: 'Could not retrieve access token' };
      callback(null, error);
    }
  });
}

export const beginGetOutlookEventsEpics = action$ => action$.pipe(
  ofType(GET_OUTLOOK_EVENTS_BEGIN),
  mergeMap(() => from(new Promise((resolve, reject) => {
    getUserEvents((events, error) => {
      resolve(events);
    });
  })).pipe(
    map((resp) => {
      return getEventsSuccess(resp, 'OUTLOOK');
    })
  )
  )
);