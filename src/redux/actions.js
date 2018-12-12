/*
 * action types
 */
export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';

export function addNewEvent(newEvent) {
  return {
    type: ADD_NEW_EVENT,
    payload: {
      newEvent: newEvent
    }
  }
}
