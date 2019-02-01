import { BEGIN_GET_GOOGLE_CALENDAR,
         successGetGoogleCalendar,
         failGetGoogleCalendar } from '../redux/actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import {ajax} from 'rxjs/ajax';
import { from } from 'rxjs';


export const getGoogleCalendarEpic = action$ => action$.pipe(
  ofType(BEGIN_GET_GOOGLE_CALENDAR),
  map(() => {
    from(window.gapi.client.request({
      'path': `https://www.googleapis.com/calendar/v3/calendars/primary/events`
    })).pipe(
      map(resp => {
        debugger
        return resp
      }),
      catchError(error => console.log('error: ', error))
    )
  })
);

/*window.gapi.client.request({
     'path': `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
   }).then(resp => {
   let events = resp.result.items;
   next({
     type: action.type + '_SUCCESS',
     payload: {
       data: events
     }
   });
 }, (reason) => {
   next({
     type: action.type + '_FAILURE',
     payload: {
       data: reason
     }
   });
 });*/
