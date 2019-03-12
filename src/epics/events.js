import { GET_EVENTS_BEGIN,
  POST_EVENT_BEGIN,
  getEventsSuccess,
  postEventSuccess,
  DELETE_EVENT_BEGIN,
  GET_OUTLOOK_EVENTS_BEGIN, 
  CLEAR_ALL_EVENTS,
  EDIT_EVENT_BEGIN,
  getEventsFailure,

} from '../actions/events';
import { duplicateAction } from '../actions/db/events';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from,iif,of } from 'rxjs';
import { normalize, schema } from 'normalizr';
import { loadClient,
  loadFullCalendar,
  loadSyncCalendar,
  loadNextPage,
  postGoogleEvent,
  deleteGoogleEvent
} from '../utils/client/google';

import * as Providers from '../utils/constants'; 

import { getUserEvents } from '../utils/client/outlook';

import * as RxDB from 'rxdb';

export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
  mergeMap(action => iif(() => action.payload !== undefined, 
    from(loadClient()).pipe(
      mergeMap(() => { 
        return from(setCalendarRequest()).pipe(
          mergeMap(resp => from(eventsPromise(resp)).pipe(
            map((resp) => {
              return getEventsSuccess(resp, Providers.GOOGLE);
            })
          )
          )
        );}  
      )
    ),
    of(getEventsFailure("Google user undefined!!"))
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

// export const beginEditEventEpics = action$ => action$.pipe(
//   ofType(EDIT_EVENT_BEGIN),
//   mergeMap(action => from(editEvent(action.payload)).pipe(
//      map(resp => editEventSuccess([resp.result]))
//   )
//  )
// )

// export const deleteEventEpics = action$ => action$.pipe(
//   ofType(DELETE_EVENT_BEGIN),
//   mergeMap(action => from(deleteEvent(action.payload)).pipe(
//      map(resp => deleteEventSuccess([resp.result]))
//   )
//  )
// )


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
  let results = normalize({ events : response }, { events: [ singleEvent ]});
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
export const beginGetOutlookEventsEpics = action$ => action$.pipe(
  ofType(GET_OUTLOOK_EVENTS_BEGIN),
  mergeMap(action => 
    from(new Promise((resolve, reject) => {
      if(action.payload === undefined) {
        reject(getEventsFailure("Outlook user undefined!!"));
      }

      // console.log("Outlook Performing full sync", action);
      getUserEvents(action.payload.accessToken, action.payload.accessTokenExpiry, (events, error) => {
        if(error) {
          console.error(error);
          return;
        }

        resolve(events);
      });
    }))
      .pipe(
        map((resp) => {
          return getEventsSuccess(resp, Providers.OUTLOOK);
        }),
        catchError((error) => {
          return of(error);
        })
      )
  )
);
// of(getEventsFailure("hello world")),

// export const beginGetOutlookEventsEpics = action$ => action$.pipe(
//   ofType(GET_OUTLOOK_EVENTS_BEGIN),
//   mergeMap(action => 
//     from(new Promise((resolve, reject) => {
//       if(action.payload === undefined) {
//         reject("User not defined!!");
//       }

//       console.log("Outlook Performing full sync", action);
//       getUserEvents(action.payload.accessToken, action.payload.accessTokenExpiry, (events, error) => {
//         if(error) {
//           console.error(error);
//           return;
//         }

//         resolve(events);
//       });
//     })).pipe(
//       map((resp) => {
//         return getEventsSuccess(resp, Providers.OUTLOOK);
//       })
//     )
//   )
// );
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
