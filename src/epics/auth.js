import * as AuthActionTypes from '../actions/auth';
import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, 
  mergeMap
} from 'rxjs/operators';
import getDb from '../db';

export const storeUsersEpics = (action$) => action$.pipe(
  ofType(AuthActionTypes.SUCCESS_GOOGLE_AUTH),
  mergeMap(action => from(getDb()).pipe(
    map(db => { 
      updateDatabase(db,action.payload.user); 
    }),
  ))
);

const updateDatabase =  (db,user) => {
  db.provider_users.upsert(user);
  return;
};