/*
 * action types
 */
export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const GET_GOOGLE_EVENTS = 'GET_GOOGLE_EVENTS';
export const GET_GOOGLE_EVENTS_SUCCESS = 'GET_GOOGLE_EVENTS_SUCCESS';
export const GET_GOOGLE_EVENTS_FAILURE = 'GET_GOOGLE_EVENTS_FAILURE';
export const GET_OUTLOOK_EVENTS = 'GET_OUTLOOK_EVENTS';
export const GET_OUTLOOK_EVENTS_SUCCESS = 'GET_OUTLOOK_EVENTS_SUCCESS';
export const GET_OUTLOOK_EVENTS_FAILURE = 'GET_OUTLOOK_EVENTS_FAILURE';
export const BEGIN_GOOGLE_AUTH = 'BEGIN_GOOGLE_AUTH';



export function addNewEvent(newEvent) {
  return {
    type: ADD_NEW_EVENT,
    payload: {
      newEvent: newEvent
    }
  }
}
export function updateEvents(updatedEvents) {
  return {
    type: UPDATE_EVENTS,
    payload: {
      updatedEvents: updatedEvents
    }
  }
}

export function getGoogleEvents() {
  return {
    type: GET_GOOGLE_EVENTS,
    payload: {

    }
  }
}

export function getOutlookEvents() {
  return {
    type: GET_OUTLOOK_EVENTS,
    payload: {
    },
    meta: {
      api_status: 'REQUEST',
      call: 'GET'
    }
  }
}
