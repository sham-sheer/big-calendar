/*
 * action types
 */
export const UPDATE_EVENTS = 'UPDATE_EVENTS';
export const GET_GOOGLE_EVENTS_BEGIN = 'GET_GOOGLE_EVENTS_BEGIN';
export const GET_GOOGLE_EVENTS_SUCCESS = 'GET_GOOGLE_EVENTS_SUCCESS';
export const GET_GOOGLE_EVENTS_FAILURE = 'GET_GOOGLE_EVENTS_FAILURE';
export const GET_OUTLOOK_EVENTS = 'GET_OUTLOOK_EVENTS';
export const GET_OUTLOOK_EVENTS_SUCCESS = 'GET_OUTLOOK_EVENTS_SUCCESS';
export const GET_OUTLOOK_EVENTS_FAILURE = 'GET_OUTLOOK_EVENTS_FAILURE';
export const BEGIN_GOOGLE_AUTH = 'BEGIN_GOOGLE_AUTH';
export const SUCCESS_GOOGLE_AUTH = 'SUCCESS_GOOGLE_AUTH';
export const GET_GOOGLE_CALENDAR_LIST_BEGIN = 'GET_GOOGLE_CALENDAR_LIST_BEGIN';
export const GET_GOOGLE_CALENDAR_BEGIN = 'GET_GOOGLE_CALENDAR_BEGIN';
export const POST_GOOGLE_EVENT = 'POST_GOOGLE_EVENT';
export const POST_GOOGLE_EVENT_SUCCESS = 'POST_GOOGLE_EVENT_SUCCESS';
export const INITIAL_SYNC_EVENTS = 'INITIAL_SYNC_EVENTS' //Not sure whether i need this

export const updateEvents = (updatedEvents) => ({
    type: UPDATE_EVENTS,
    payload: updatedEvents
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

export const getGoogleCalendar = () => ({ type: GET_GOOGLE_CALENDAR_BEGIN })

export const getGoogleCalendarListBegin = () => ({ type: GET_GOOGLE_CALENDAR_LIST_BEGIN })

export const beginGetGoogleEvents = () => ({ type: GET_GOOGLE_EVENTS_BEGIN })

export const beginGoogleAuth = () => ({ type: BEGIN_GOOGLE_AUTH })

export const getOutlookEvents = () => ({ type: GET_OUTLOOK_EVENTS })

export const initialSyncEvents = () => ({ type: INITIAL_SYNC_EVENTS})
