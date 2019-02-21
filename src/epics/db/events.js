import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import md5 from 'md5';
import {
  RETRIEVE_STORED_EVENTS,
  duplicateAction,
  updateStoredEvents
} from '../../actions/db/events';
import getDb from '../../db';

/*function retrieveEvents(db) {
  let data = [];
  await db.events.find().exec().then(events => {
      data = events.map(singleEvent => {
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
      });
  });
  debugger
  return data;
}*/

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
        )
      )
    )
    ),
  ),
  map(results => {
    return updateStoredEvents(results);
  })
)
