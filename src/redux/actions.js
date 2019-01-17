/*
 * action types
 */
export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

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

export function getEvents() {
  return {
    type: GET_EVENTS,
    payload: {
    },
    meta: {
      api_status: 'REQUEST',
      call: 'GET'
    }
  }
}
