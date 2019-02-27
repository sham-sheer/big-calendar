import { GET_EVENTS_BEGIN } from '../actions/events';
import { duplicateAction } from '../actions/db/events';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { normalize, schema } from 'normalizr';


export const beginGetEventsEpics = action$ => action$.pipe(
  ofType(GET_EVENTS_BEGIN),
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

const normalizeEvents = (response) => {
  let singleEvent = new schema.Entity('events');
  let results = normalize({ events : response}, { events: [ singleEvent ]});
  return results;
};

const fetchEvents = (resp, items, resolve, reject) => {
  const newItems = items.concat(resp.result.items);
  let pageToken = resp.nextPageToken;
  let syncToken = resp.nextSyncToken;
  if(pageToken !== undefined) {
    window.gapi.client.calendar.events.list({
      'calendarId' : 'primary',
      'pageToken': pageToken
    }).then(nextResp => fetchEvents(nextResp, newItems, resolve, reject))
      .catch(e => {
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
