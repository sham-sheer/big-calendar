import { ADD_NEW_EVENT, UPDATE_EVENTS, GET_GOOGLE_EVENTS, GET_GOOGLE_EVENTS_SUCCESS, GET_GOOGLE_EVENTS_FAILURE, GET_OUTLOOK_EVENTS_SUCCESS, GET_OUTLOOK_EVENTS_FAILURE } from './actions';

const initialState = {
  events: [
    {
      allDay: false,
      end: new Date('December 12, 2018 02:13:00'),
      start: new Date('December 12, 2018 01:13:00'),
      title: 'New Event',

    }
  ],
  google_data: [],
  outlook_data: [],
  error: '',
  beginAPi: false
}


export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_NEW_EVENT:
      const newEventsList = state.events.concat(action.payload.newEvent);
      return {
        ...state,
        events: newEventsList
      }
    case UPDATE_EVENTS:
      return {
        ...state,
        events: action.payload.updatedEvents
      }
    case GET_GOOGLE_EVENTS:
      return {
        ...state,
        beginAPi: true
      }
    case GET_GOOGLE_EVENTS_SUCCESS:
      return {
        ...state,
        google_data: action.payload.data
      }
    case GET_GOOGLE_EVENTS_FAILURE:
      return {
        ...state,
        error: action.payload.error
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
    default:
      return state;
  }
}
