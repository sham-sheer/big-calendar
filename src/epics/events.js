import { GET_EVENTS_BEGIN,
         getEventsSuccess
} from '../actions/events';
import { duplicateAction } from '../actions/db/events';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { normalize, schema } from 'normalizr';
import { loadClient, loadFullCalendar, loadSyncCalendar } from '../utils/client/google';

export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
<<<<<<< HEAD
  mergeMap(() => from(loadClient()).pipe(
      mergeMap(() => from(setCalendarRequest()).pipe(
            mergeMap(resp => from(eventsPromise(resp)).pipe(
                map((resp) => {
                  let result = normalizeEvents(resp);
                  debugger;
                  return getEventsSuccess(result);
                })
              )
            )
          )
      )
    )
  )
)
=======
  mergeMap(() => {
    let load = new Promise((resolve, reject) =>
      resolve(window.gapi.client.load('calendar', 'v3'))
    );
    debugger;
    from(load).pipe(
      mergeMap(() => {
        debugger;
        let syncToken = localStorage.getItem('sync');
        let request;
        if(syncToken == null) {
          console.log('performing full sync');
          request = new Promise((resolve,reject) => {
            return resolve(window.gapi.client.calendar.events.list({
              'calendarId' : 'primary'
            }));
          });
        }
        else {
          console.log('performing incremental sync');
          request = new Promise((resolve,reject) => {
            return resolve(window.gapi.client.calendar.events.list({
              'calendarId' : 'primary',
              'syncToken'  : syncToken
            }));
          });
        }
        debugger;
        from(request).pipe(
          map(resp => {
            let result = [];
            const results = new Promise((resolve, reject) => {
              fetchEvents(resp, result, resolve, reject);
            });
            debugger;
            return duplicateAction();
          })
        );
      })
    );
    /*window.gapi.client.load('calendar', 'v3')
      .then(() => {
        let syncToken = localStorage.getItem('sync');
        let request;
        if(syncToken == null) {
          console.log('performing full sync');
          request =  window.gapi.client.calendar.events.list({
            'calendarId' : 'primary'
          });
        }
        else {
          console.log('performing incremental sync');
          request = window.gapi.client.calendar.events.list({
            'calendarId' : 'primary',
            'syncToken': syncToken
          });
        }
        return request;
      })
      .then(resp => {
        let result = [];
        const results = new Promise((resolve, reject) => {
          fetchEvents(resp, result, resolve, reject);
        })
        return results;
      })
      .then(response => {
        debugger;
      })
      return duplicateAction();*/
  })
);
>>>>>>> c9ff191e3b06359f1b8affa2d8ae16d67709a46b

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
  let pageToken = resp.result.nextPageToken;
  let syncToken = resp.result.nextSyncToken;
  debugger
  if(pageToken !== undefined) {
    window.gapi.client.calendar.events.list({
      'calendarId' : 'primary',
      'pageToken': pageToken
    }).then(nextResp => {
      debugger
      return fetchEvents(nextResp, newItems, resolve, reject)
    }).catch(e => {
        if(e.code === 410) {
          console.log('Invalid sync token, clearing event store and re-syncing.');
          localStorage.deleteItem('sync');
          window.gapi.client.calendar.events.list({
            'calendarId' : 'primary',
          }).then(newResp => fetchEvents(newResp, items, resolve, reject));
        } else {
          console.log(e);
          reject('Something went wrong, Please refresh and try again');
        }
      });
  } else {
    localStorage.setItem('sync', syncToken);
    resolve(newItems);
  }
};
