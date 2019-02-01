import { createSelector } from 'reselect';
import moment from 'moment';

const getGoogleEvents = state => state.events.google_data;


//process google events data
export const getFilteredEvents = createSelector(
  [getGoogleEvents],
  (google_data) => {
    const formated_events = google_data
    .map(eachEvent => {
        if(eachEvent.end.date === undefined) {
          return {
            title: eachEvent.summary,
            end: eachEvent.end.dateTime,
            start: eachEvent.start.dateTime
          }
        }
        else {
          return {
            title: eachEvent.summary,
            end:  moment(eachEvent.end.date).format(),
            start: moment(eachEvent.start.date).format()
          }
        }
      }
    );
    return formated_events
  }
)
