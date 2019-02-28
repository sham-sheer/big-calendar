import {
  UPDATE_STORED_EVENTS,
  SUCCESS_STORED_EVENTS,
  DUPLICATE_ACTION
} from '../actions/db/events';

const initialState = {
  calEvents: [],
};

const mergeEvents = (oldEvents, newItems) => {
  debugger;
  let oldIds = oldEvents.map(item => item.id);
  let newPayload = [...oldEvents];
  for(let newItem of newItems) {
    if(!oldIds.includes(newItem.id)) {
      newPayload.push(newItem);
    }
  }
  return newPayload;
};

export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_STORED_EVENTS:
      return Object.assign({}, state, { calEvents: action.payload });
    case SUCCESS_STORED_EVENTS: {
      debugger
      let newEvents = mergeEvents(state.calEvents, action.payload);
      return Object.assign({}, state, { calEvents: newEvents });
    }
    case DUPLICATE_ACTION:
      return state;
    default:
      return state;
  }
}
