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
import {
  storeGoogleAuthEpic
} from './db/auth';
import {
  storeEventPersonEpic
} from './db/eventPersons';

export const rootEpic = combineEpics(
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  beginGetEventsEpics,
  beginGetOutlookEventsEpics,
  beginPostEventEpics,
  deleteEventEpics,
  clearAllEventsEpics,
  storeGoogleAuthEpic
);
