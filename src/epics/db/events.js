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
} from '../../actions/events';
import {
  deleteGoogleEvent,
  loadClient
} from '../../utils/client/google';
import getDb from '../../db';
import * as Providers from '../../utils/constants';

export const retrieveEventsEpic = action$ => action$.pipe(
  ofType(RETRIEVE_STORED_EVENTS),
  mergeMap((action) => from(getDb()).pipe(
    mergeMap(db => from(db.events.find().exec()).pipe(
      map(events => events.filter(singleEvent => {
        return singleEvent.providerType === action.providerType;
      })),
      map(events => events.map(singleEvent => {
        return {
          'id' : singleEvent.id,
          'end' : singleEvent.end,
          'start': singleEvent.start,
          'summary': singleEvent.summary,
          'organizer': singleEvent.organizer,
          'recurrence': singleEvent.recurrence,
          'iCalUID': singleEvent.iCalUID,
          'attendees': singleEvent.attendees,
          'originalId': singleEvent.originalId
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
    return beginStoringEvents(action.payload);
  })
);

export const deleteEventEpics = action$ => action$.pipe(
  ofType(DELETE_EVENT_BEGIN),
  mergeMap((action) => from(deleteEvent(action.payload)).pipe(
    map(() => retrieveStoreEvents()),
  )
  ),
);


const storeEvents = async (payload) => {
  const db = await getDb();
  const addedEvents = [];
  const data = payload.data;

  for(let dbEvent of data) {
    // #TO-DO, we need to figure out how to handle recurrence, for now, we ignore
    if(dbEvent.recurringEventId !== undefined) {
      continue;
    }

    let filteredEvent = filterIntoSchema(dbEvent, payload.providerType);
    filteredEvent['providerType'] = payload.providerType;

    try {
      await db.events.upsert(filteredEvent);
    }
    catch(e) {
      return e;
    }
    // Adding filtered event coz if I added dbEvent, it will result it non compatability with outlook objects.
    addedEvents.push(filteredEvent);
  }
  return addedEvents;
};

const filterIntoSchema = (dbEvent, type) => {
  switch(type) {
    case Providers.GOOGLE:
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
      dbEvent.providerType = Providers.GOOGLE;

      return dbEvent;
    case Providers.OUTLOOK:
      ['@odata.etag'].forEach(e => delete dbEvent[e]);
      var schemaCastedDbObject = {};

      schemaCastedDbObject.id = md5(dbEvent.id);
      schemaCastedDbObject.originalId = dbEvent.id;
      schemaCastedDbObject.htmlLink = dbEvent.webLink;
      schemaCastedDbObject.status = dbEvent.isCancelled ? 'cancelled' : 'confirmed';    
      schemaCastedDbObject.created = dbEvent.createdDateTime;
      schemaCastedDbObject.updated = dbEvent.lastModifiedDateTime;
      schemaCastedDbObject.summary = dbEvent.subject;
      schemaCastedDbObject.description = dbEvent.bodyPreview; // Might need to use .body instead, but it returns html so idk how to deal w/ it now
      schemaCastedDbObject.location = JSON.stringify(dbEvent.location.coordinates); // We need to convert coordinates coz idk how else to represent it
      schemaCastedDbObject.creator = dbEvent.organizer.emailAddress.address;
      schemaCastedDbObject.organizer = { email: dbEvent.organizer.emailAddress.address, displayName: dbEvent.organizer.emailAddress.name };
      schemaCastedDbObject.start = { dateTime: dbEvent.start.dateTime, timezone: dbEvent.originalStartTimeZone };
      schemaCastedDbObject.end = { dateTime: dbEvent.end.dateTime, timezone: dbEvent.originalEndTimeZone };
      // schemaCastedDbObject.endTimeUnspecified = dbEvent.responseStatus;
      // schemaCastedDbObject.recurrence = dbEvent.recurrence;      // Need to write converted from microsoft graph lib to standard array
      schemaCastedDbObject.recurringEventId = dbEvent.seriesMasterId;
      schemaCastedDbObject.originalStartTime = { dateTime: dbEvent.originalStartTime, timezone: dbEvent.originalStartTimeZone };
      // schemaCastedDbObject.transparency = dbEvent.responseStatus;
      schemaCastedDbObject.visibility = "default";
      schemaCastedDbObject.iCalUID = dbEvent.iCalUId;
      // schemaCastedDbObject.sequence = dbEvent.responseStatus;
      schemaCastedDbObject.attendees = dbEvent.attendees;

      // schemaCastedDbObject.anyoneCanAddSelf = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanInviteOthers = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanModify = dbEvent.responseStatus;
      // schemaCastedDbObject.guestsCanSeeOtherGuests = dbEvent.responseStatus;
      // schemaCastedDbObject.privateCopy = dbEvent.responseStatus;
      // schemaCastedDbObject.locked = dbEvent.responseStatus;
      schemaCastedDbObject.allDay = dbEvent.isAllDay;

      // schemaCastedDbObject.calenderId = dbEvent.responseStatus;
      // schemaCastedDbObject.source = dbEvent.responseStatus;
      schemaCastedDbObject.providerType = Providers.OUTLOOK;

      return schemaCastedDbObject;
    default:
      console.log("Provider " + type + " not available");
  }
};

const deleteEvent = async (id) => {
  const db = await getDb();
  await loadClient();
  const query = db.events.find().where("id").eq(id);
  const originalDocument = await query.exec();
  const originalId = originalDocument[0].get("originalId");
  const responseFromAPI = await deleteGoogleEvent(originalId);
  await query.remove();
};
