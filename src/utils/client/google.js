import md5 from 'md5';
import * as ProviderTypes from '../constants';

export const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
export const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;


export async function loadClient() {
  let result =  new Promise((resolve, reject) => {
    if (window.gapi.client === undefined) {
      reject("Client undefined!");
    }

    resolve(window.gapi.client.load('calendar', 'v3'));
  });
  return result;
}

export const loadFullCalendar = async () =>  {
  return new Promise((resolve) => {
    resolve( window.gapi.client.calendar.events.list({
      'calendarId' : 'primary'
    }));
  });
};

export const loadSyncCalendar = async (syncToken) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.list({
      'calendarId' : 'primary',
      'syncToken'  : syncToken
    }));
  });
};

export const postGoogleEvent = async (calendarObject) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.insert(calendarObject));
  });
};

export const editGoogleEvent = async (eventId ,eventObject) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.patch({
      'calendarId' : 'primary',
      'eventId'    : eventId,
      'eventObject': eventObject
    }));
  });
};

export const deleteGoogleEvent = async (eventId) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.delete({
      'calendarId' : 'primary',
      'eventId'    :  eventId
    }));
  });
};

export const loadNextPage = async (pageToken) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.list({
      'calendarId' : 'primary',
      'pageToken': pageToken
    }));
  });
};

export const filterUser = (jsonObj, accessToken, accessTokenExpiry) => {
  return {
    personId: md5(jsonObj.getId()),
    originalId: jsonObj.getId(),
    email: jsonObj.getEmail(),
    providerType: ProviderTypes.GOOGLE,
    accessToken: accessToken,
    accessTokenExpiry: accessTokenExpiry,
  };
};

// This filter user is used when the outlook first creates the object. 
// It takes the outlook user object, and map it to the common schema defined in db/person.js
export const filterUserOnStart = (rxDoc) => {
  return { 
    user: {
      personId: rxDoc.personId,
      originalId: rxDoc.originalId,
      email: rxDoc.email,
      providerType: ProviderTypes.GOOGLE,
      accessToken: rxDoc.accessToken,
      accessTokenExpiry: rxDoc.accessTokenExpiry,
    }
  };
};