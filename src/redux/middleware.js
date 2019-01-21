import { createLogger } from 'redux-logger';
import axios from 'axios';
export const loggerMiddleware = createLogger();


const CALENDAR_ID = 'shamsheer619@gmail.com';
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

function googleCalendarEvents() {
  return window.gapi.client.request({
        'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      }).then(resp => {
      let events = resp.result.items;
      console.log(events);
    }, (reason) => {
      console.log(reason);
    });
}

function getUserEvents() {
  return MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, window.localStorage.getItem('at'))
    }
  }).api('/me/events')
    .top(10)
    .select('subject,start,end,createdDatetime')
    .orderby('createdDatetime DESC')
    .get((err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res.value);
      }
    });
}


export const apiMiddleware = store => next => action => {
  if(action.type === 'GET_GOOGLE_EVENTS') {
    googleCalendarEvents();
  }
  if(action.type == 'GET_OUTLOOK_EVENTS') {
    const url = action.payload.url;
    getUserEvents();
  }
  return next(action);
}
