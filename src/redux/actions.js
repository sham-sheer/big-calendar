/*
 * action types
 */
export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const GET_GOOGLE_EVENTS_BEGIN = 'GET_GOOGLE_EVENTS_BEGIN';
export const NEXT_GET_GOOGLE_EVENTS = 'NEXT_GET_GOOGLE_EVENTS';
export const LAST_GET_GOOGLE_EVENTS = 'LAST_GET_GOOGLE_EVENTS';
export const GET_GOOGLE_EVENTS_SUCCESS = 'GET_GOOGLE_EVENTS_SUCCESS';
export const GET_GOOGLE_EVENTS_FAILURE = 'GET_GOOGLE_EVENTS_FAILURE';
export const GET_OUTLOOK_EVENTS = 'GET_OUTLOOK_EVENTS';
export const GET_OUTLOOK_EVENTS_SUCCESS = 'GET_OUTLOOK_EVENTS_SUCCESS';
export const GET_OUTLOOK_EVENTS_FAILURE = 'GET_OUTLOOK_EVENTS_FAILURE';
export const BEGIN_GOOGLE_AUTH = 'BEGIN_GOOGLE_AUTH';
export const SUCCESS_GOOGLE_AUTH = 'SUCCESS_GOOGLE_AUTH';
export const BEGIN_GET_GOOGLE_CALENDAR = 'BEGIN_GET_GOOGLE_CALENDAR';
export const POST_GOOGLE_EVENT = 'POST_GOOGLE_EVENT';
export const POST_GOOGLE_EVENT_SUCCESS = 'POST_GOOGLE_EVENT_SUCCESS';
export const INITIAL_SYNC_EVENTS = 'INITIAL_SYNC_EVENTS';

export const updateEvents = (updatedEvents) => ({
    type: UPDATE_EVENTS,
    payload: {
      updatedEvents: updatedEvents
    }
})

export const successGoogleAuth = (user) => ({
  type: SUCCESS_GOOGLE_AUTH,
  payload: {
    user
  }
})

export const postGoogleEvent = (event) => ({
  type: POST_GOOGLE_EVENT,
  payload: {
    event
  }
})

export const beginGetGoogleEvents = () => ({ type: GET_GOOGLE_EVENTS_BEGIN })

export const beginGoogleAuth = () => ({ type: BEGIN_GOOGLE_AUTH })

export const beginGetGoogleCalendar = () => ({ type: BEGIN_GET_GOOGLE_CALENDAR })

export const getOutlookEvents = () => ({ type: GET_OUTLOOK_EVENTS })

export const initialSyncEvents = () => ({ type: INITIAL_SYNC_EVENTS})
