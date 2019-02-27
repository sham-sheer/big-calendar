import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import md5 from 'md5';
import {
  RETRIEVE_STORED_EVENTS,
  BEGIN_STORE_EVENTS,
  duplicateAction,
  updateStoredEvents,
  successStoringEvents,
  failStoringEvents,
  beginStoringEvents
} from '../../actions/db/events';
import {
  POST_EVENT_SUCCESS,
  GET_EVENTS_SUCCESS
} from '../../actions/events';
import getDb from '../../db';

export const retrieveEventsEpic = action$ => action$.pipe(
  ofType(RETRIEVE_STORED_EVENTS),
  mergeMap(() => from(getDb()).pipe(
    mergeMap(db => from(db.events.find().exec()).pipe(
        map(events => events.map(singleEvent => {
              return {
                  'id' : md5(singleEvent.id),
                  'end' : singleEvent.end,
                  'start': singleEvent.start,
                  'summary': singleEvent.summary,
                  'organizer': singleEvent.organizer,
                  'recurrence': singleEvent.recurrence,
                  'iCalUID': singleEvent.iCalUID,
                  'attendees': singleEvent.attendees
                }
          })
        ),
        map(results => {
          return updateStoredEvents(results);
            })
          )
        )
      ),
    ),
  )

export const storeEventsEpic = action$ => action$.pipe(
    ofType(BEGIN_STORE_EVENTS),
    map(({payload}) => filter(payload)),
    mergeMap((payload) => from(storeEvents(payload)).pipe(
      map(results => successStoringEvents(results)),
      catchError(error => failStoringEvents(error))
    ))
  )

export const beginStoreEventsEpic = action$ => action$.pipe(
  ofType(POST_EVENT_SUCCESS, GET_EVENTS_SUCCESS),
  map(({ payload }) => beginStoringEvents(payload))
)


async function storeEvents(events){
      const db = await getDb();
      debugger
      const addEvents = [];
      const results = events.map(async dbEvent => {
        if(!!dbEvent.id) {
          try {
            await db.events.upsert(dbEvent);
          } catch(e) {
            return e;
          }
          return dbEvent;
        }
      });
      let values = await Promise.all(results);
      debugger
      return values;
  }

const filter = (events) => {
    if(events.data !== undefined) {
      debugger
      const formated_events = events.data
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
      return formated_events;
    }
    else {
      return [];
    }
  }
