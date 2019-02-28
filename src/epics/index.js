import { combineEpics } from 'redux-observable';
import {
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  deleteEventEpics
} from './db/events';
import {
  beginGetEventsEpics,
  beginPostEventEpics
} from './events';

export const rootEpic = combineEpics(
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  beginGetEventsEpics,
  beginPostEventEpics,
  deleteEventEpics
);
