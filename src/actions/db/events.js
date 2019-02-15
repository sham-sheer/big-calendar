export const BEGIN_STORE_EVENTS = 'BEGIN_STORE_EVENTS';
export const FAIL_STORE_EVENTS = 'FAIL_STORE_EVENTS';
export const RETRIEVE_STORED_EVENTS = 'RETRIEVE_STORED_EVENTS';
export const SUCCESS_STORED_EVENTS = 'SUCCESS_STORED_EVENTS';
export const UPDATE_STORED_EVENTS = 'UPDATE_STORED_EVENTS';

export const failStoringEvents = () => ({
  type: FAIL_STORE_EVENTS
});
export const retrieveStoreEvents = () => ({
  type: RETRIEVE_STORED_EVENTS
})
