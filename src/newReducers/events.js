import {
  UPDATE_STORED_EVENTS
} from '../actions/db/events';
import {
  SUCCESS_STORED_EVENTS
} from '../actions/db/events';

const initialState = {
  calEvents: [],
}

const mergeEvents = (oldEvents, newItems) => {
  debugger
  let oldIds = oldEvents.map(item => item.id);
  let newPayload = [...oldEvents];
  for(let newItem of newItems) {
    if(!oldIds.includes(newItem.id)) {
      newPayload.push(newItem)
    }
  }
  return newPayload;
}

export default function eventsReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_STORED_EVENTS:
      return Object.assign({}, state, { calEvents: action.payload });
    case SUCCESS_STORED_EVENTS: {
      let newEvents = mergeEvents(state.calEvents, action.item)
      return Object.assign({}, state, { calEvents: newEvents })
    }
    default:
      return state
  }
}
