export const GET_EVENTS_BEGIN = 'GET_EVENTS_BEGIN';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const POST_EVENT_BEGIN = 'POST_EVENT_BEGIN';
export const POST_EVENT_SUCCESS = 'POST_EVENT_SUCCESS';
export const POST_EVENT_FAILURE = 'POST_EVENT_FAILURE';

export const MOVE_EVENT_BEGIN = 'BEGIN_MOVE_EVENT';
export const MOVE_EVENT_SUCCESS = 'MOVE_EVENT_SUCCESS';
export const MOVE_EVENT_FAILURE = 'MOVE_EVENT_FAILURE';


//You good bro?
export const EDIT_EVENT_BEGIN = 'EDIT_EVENT_BEGIN';
export const EDIT_EVENT_SUCCESS = 'EDIT_EVENT_SUCCESS';
export const EDIT_EVENT_FAILURE = 'EDIT_EVENT_FAILURE';

export const QUICK_ADD_EVENT_BEGIN = 'QUICK_ADD_EVENT_BEGIN';
export const QUICK_ADD_EVENT_SUCCESS = 'QUICK_ADD_EVENT_SUCCESS';
export const QUICK_ADD_EVENT_FAILURE = 'QUICK_ADD_EVENT_FAILURE';

export const UPDATE_EVENTS_BEGIN = 'UPDATE_EVENTS_BEGIN';
export const UPDATE_EVENTS_SUCCESS = 'UPDATE_EVENTS_SUCCESS';
export const UPDATE_EVENTS_FAILURE = 'UPDATE_EVENTS_FAILURE';

export const DELETE_EVENT_BEGIN = 'DELETE_EVENT_BEGIN';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const DELETE_EVENT_BEGIN_API = 'DELETE_EVENT_BEGIN_API';
export const DELETE_EVENT_SUCCESS_API = 'DELETE_EVENT_SUCCESS_API';
export const DELETE_EVENT_FAILURE_API = 'DELETE_EVENT_FAILURE_API';

export const beginGetGoogleEvents = (resp) => ({
  type: GET_EVENTS_BEGIN,
  payload: resp
});

export const postEventBegin = (calEvent) => ({
  type: POST_EVENT_BEGIN,
  payload: calEvent
});

export const getEventsSuccess = (response, providerType) => ({
  type: GET_EVENTS_SUCCESS,
  payload: {
    data: response,
    providerType: providerType,
  }
});

export const postEventSuccess = (response) => ({
  type: POST_EVENT_SUCCESS,
  payload: response
});

export const beginDeleteEvent = (id) => ({
  type: DELETE_EVENT_BEGIN,
  payload: id
});

// ---------------------- OUTLOOK ---------------------- //
export const GET_OUTLOOK_EVENTS_BEGIN = 'GET_OUTLOOK_EVENTS_BEGIN';
export const GET_OUTLOOK_EVENTS_SUCCESS = 'GET_OUTLOOK_EVENTS_SUCCESS';
export const GET_OUTLOOK_EVENTS_FAILURE = 'GET_OUTLOOK_EVENTS_FAILURE';

export const beginGetOutlookEvents = (resp) => ({ 
  type: GET_OUTLOOK_EVENTS_BEGIN,
  payload: resp
});

export const postOutlookEventBegin = (calEvent) => ({
  type: GET_OUTLOOK_EVENTS_FAILURE,
  payload: calEvent
});

export const getOutlookEventsSuccess = (response) => ({
  type: GET_OUTLOOK_EVENTS_SUCCESS,
  payload: {
    data: response,
  }
});
// ---------------------- OUTLOOK ---------------------- //

// ---------------------- GENERAL ---------------------- //
export const CLEAR_ALL_EVENTS = 'CLEAR_ALL_EVENTS';

export const clearAllEvents = () => ({ 
  type: CLEAR_ALL_EVENTS,
});
// ---------------------- GENERAL ---------------------- //
