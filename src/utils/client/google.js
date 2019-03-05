export const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
export const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;


export async function loadClient() {
  let result =  new Promise((resolve) => {
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
  })
}

export const deleteGoogleEvent = async (eventId) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.delete('primary', eventId));
  })
}

export const loadNextPage = async (pageToken) => {
  return new Promise((resolve) => {
    resolve(window.gapi.client.calendar.events.list({
      'calendarId' : 'primary',
      'pageToken': pageToken
    }));
  });
};
