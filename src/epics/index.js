import { combineEpics } from 'redux-observable';
import {
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
} from './db/events';
import {
  beginGetEventsEpics,
  beginGetOutlookEventsEpics
} from './events';

export const rootEpic = combineEpics(
  retrieveEventsEpic,
  storeEventsEpic,
  beginStoreEventsEpic,
  beginGetEventsEpics,
  beginGetOutlookEventsEpics
);
