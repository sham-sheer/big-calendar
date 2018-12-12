import { ADD_NEW_EVENT } from './actions';

const initialState = {
  events: [
    {
      allDay: false,
      end: new Date('December 10, 2018 11:13:00'),
      start: new Date('December 09, 2018 12:13:00'),
      title: 'hi',
    },
    {
      allDay: true,
      end: new Date('December 05, 2018 11:13:00'),
      start: new Date('December 05, 2018 11:13:00'),
      title: 'All Day Event',
    }
  ]
}


export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_NEW_EVENT:
      return {
      ...state,
      events: action.payload.events
      }
    default:
      return state;
  }
}
