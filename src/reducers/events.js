import {
         UPDATE_EVENTS,
         GET_GOOGLE_EVENTS_BEGIN,
         GET_GOOGLE_EVENTS_SUCCESS,
         GET_GOOGLE_EVENTS_FAILURE,
         GET_OUTLOOK_EVENTS_SUCCESS,
         GET_OUTLOOK_EVENTS_FAILURE,
         POST_GOOGLE_EVENT_SUCCESS
} from '../redux/actions';

const initialState = {
  events: [],
  google_data: [],
  outlook_data: [],
  new_event: [],
  error: '',
  beginAPI: false,
  initialSync: false
}


export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_EVENTS:
      return {
        ...state,
        google_data: state.google_data.concat(action.payload.updatedEvents),
        initialSync: true
      }
    case GET_GOOGLE_EVENTS_BEGIN:
      return {
        ...state,
        beginAPI: true
      }
    case GET_GOOGLE_EVENTS_SUCCESS:
      return {
        ...state,
        google_data: state.google_data.concat(action.payload.data),
        beginAPI: false
      }
    case GET_GOOGLE_EVENTS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        beginAPI: false
      }
    case GET_OUTLOOK_EVENTS_SUCCESS:
      return {
        ...state,
        outlook_data: action.payload.data
      }
    case GET_OUTLOOK_EVENTS_FAILURE:
      return {
        ...state,
        error: action.payload.error
      }
    case POST_GOOGLE_EVENT_SUCCESS:
      return {
        ...state,
        google_data: state.google_data.concat(action.payload.data)
      }
    default:
      return state;
  }
}
