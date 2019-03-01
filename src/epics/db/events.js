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
  beginStoringEvents,
  retrieveStoreEvents
} from '../../actions/db/events';
import {
  POST_EVENT_SUCCESS,
  GET_EVENTS_SUCCESS,
  DELETE_EVENT_BEGIN,
  deleteEventFromApi
} from '../../actions/events';
import getDb from '../../db';

export const retrieveEventsEpic = action$ => action$.pipe(
  ofType(RETRIEVE_STORED_EVENTS),
  mergeMap(() => from(getDb()).pipe(
    mergeMap(db => from(db.events.find().exec()).pipe(
      map(events => events.map(singleEvent => {
        return {
          'id' : singleEvent.id,
          'end' : singleEvent.end,
          'start': singleEvent.start,
          'summary': singleEvent.summary,
          'organizer': singleEvent.organizer,
          'recurrence': singleEvent.recurrence,
          'iCalUID': singleEvent.iCalUID,
          'attendees': singleEvent.attendees
        };
      })
      ),
      map(results => {
        return updateStoredEvents(results);
      })
    )
    )
  ),
  ),
);

export const storeEventsEpic = action$ => action$.pipe(
  ofType(BEGIN_STORE_EVENTS),
  mergeMap((action) => from(storeEvents(action.payload)).pipe(
    map(results => successStoringEvents(results)),
    catchError(error => failStoringEvents(error))
  ))
);

export const beginStoreEventsEpic = action$ => action$.pipe(
  ofType(POST_EVENT_SUCCESS, GET_EVENTS_SUCCESS),
  map((action) => {
    return beginStoringEvents(action.payload)
  })
);

export const deleteEventEpics = action$ => action$.pipe(
  ofType(DELETE_EVENT_BEGIN),
  mergeMap((action) => from(deleteEvent(action.payload)).pipe(
      map((removedEvent) => retrieveStoreEvents()),
    )
  ),
)


const storeEvents = async (events) => {
  debugger;
  const db = await getDb();
  const addedEvents = [];
  for(let dbEvent of events) {
    let filteredEvent = filter(dbEvent);
    try {
      await db.events.upsert(filteredEvent);
    }
    catch(e) {
      return e;
    }
    addedEvents.push(dbEvent);
  }
  return addedEvents;
}

const filter = (dbEvent) => {
  ['kind',
  'etag',
  'extendedProperties',
  'conferenceData',
  'reminders',
  'attachments',
  'hangoutLink'].forEach(e => delete dbEvent[e]);
  dbEvent.originalId = dbEvent.id;
  dbEvent.id = md5(dbEvent.id);
  dbEvent.creator = dbEvent.creator.email;
  debugger;
  return dbEvent;
}

const deleteEvent = async (id) => {
  const db = await getDb();
  const query = db.events.find().where("id").eq(id);
  const removedEvent = await query.remove();
  debugger;
  return removedEvent;
}
