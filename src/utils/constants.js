import md5 from 'md5';

export const OUTLOOK = 'OUTLOOK';
export const GOOGLE = 'GOOGLE';

export const filterIntoSchema = (dbEvent, type) => {
  switch(type) {
    case GOOGLE:
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
      dbEvent.providerType = GOOGLE;
  
      return dbEvent;
    case OUTLOOK:
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
      schemaCastedDbObject.recurringEventId = (dbEvent.seriesMasterId === null || dbEvent.seriesMasterId === undefined) ? "" : dbEvent.seriesMasterId;
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
      schemaCastedDbObject.providerType = OUTLOOK;
  
      return schemaCastedDbObject;
    default:
      console.log("Provider " + type + " not available");
  }
};