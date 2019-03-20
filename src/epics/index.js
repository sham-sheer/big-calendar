import { combineEpics } from 'redux-observable';
import {
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  deleteEventEpics
} from './db/events';
import {
  beginGetEventsEpics,
  beginGetOutlookEventsEpics,
  beginPostEventEpics,
  clearAllEventsEpics,
} from './events';

export const rootEpic = combineEpics(
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  beginGetEventsEpics,
  beginGetOutlookEventsEpics,
  beginPostEventEpics,
  deleteEventEpics,
  clearAllEventsEpics,
);
