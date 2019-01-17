import { ADD_NEW_EVENT, UPDATE_EVENTS, GET_EVENTS_SUCCESS, GET_EVENTS_FAILURE } from './actions';

const initialState = {
  events: [
    {
      allDay: false,
      end: new Date('December 12, 2018 02:13:00'),
      start: new Date('December 12, 2018 01:13:00'),
      title: 'New Event',

    }
  ],
  data: [],
  error: ''
}


export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_NEW_EVENT:
      const newEventsList = state.events.concat(action.payload.newEvent);
      return {
        events: newEventsList
      }
    case UPDATE_EVENTS:
      return {
        events: action.payload.updatedEvents
      }
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        data: action.payload.data
      }
    case GET_EVENTS_FAILURE:
      return {
        ...state,
        error: action.payload.error
      }
    default:
      return state;
  }
}
