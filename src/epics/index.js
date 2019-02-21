import { combineEpics } from 'redux-observable';
import { retrieveEventsEpic } from './db/events';

export const rootEpic = combineEpics(
  retrieveEventsEpic
);
