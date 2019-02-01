
import 'rxjs/add/observable/of';
import { combineEpics } from 'redux-observable';
import { beginGoogleAuthEpic,
         beginGoogleLoadAuthEpic } from './auth';
import { getGoogleCalendarEpic } from './events';

export const rootEpic = combineEpics(
  beginGoogleAuthEpic,
  beginGoogleLoadAuthEpic,
  getGoogleCalendarEpic
)
