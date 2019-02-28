import { GET_EVENTS_BEGIN,
         POST_EVENT_BEGIN,
         getEventsSuccess,
         postEventSuccess

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
         postGoogleEvent
       } from '../utils/client/google';

export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
  mergeMap(() => from(loadClient()).pipe(
      mergeMap(() => from(setCalendarRequest()).pipe(
            mergeMap(resp => from(eventsPromise(resp)).pipe(
                map((resp) => {
                  return getEventsSuccess(resp);
                })
              )
            )
          )
      )
    )
  )
)

export const beginPostEventEpics = action$ => action$.pipe(
  ofType(POST_EVENT_BEGIN),
  mergeMap(action => from(postEvent(action.payload)).pipe(
      map(resp => postEventSuccess([resp.result]))
    )
  )
 )

const postEvent = async (resource) => {
  let calendarObject = {
      'calendarId': 'primary',
      'resource': resource
  };
  await loadClient();
  return postGoogleEvent(calendarObject);
}

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
}

const normalizeEvents = (response) => {
  let singleEvent = new schema.Entity('events');
  let results = normalize({ events : response}, { events: [ singleEvent ]});
  return results;
};

const eventsPromise = async (resp) => {
  const items = [];
  return new Promise((resolve, reject) => {
    fetchEvents(resp, items, resolve, reject);
  })
}

const fetchEvents = (resp, items, resolve, reject) => {
  const newItems = items.concat(resp.result.items);
  if(resp.result.nextPageToken !== undefined) {
    loadNextPage(resp.result.nextPageToken).then(nextResp => {
      return fetchEvents(nextResp, newItems, resolve, reject)
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
