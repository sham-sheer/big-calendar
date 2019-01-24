import { createSelector } from 'reselect'

const getGoogleEvents = state => state.google_data;


//process google events data
export const getFilteredEvents = createSelector(
  [getGoogleEvents],
  (google_data) => {
    const formated_events = google_data
    .map(eachEvent => ({
      title: eachEvent.summary,
      end: eachEvent.end.date,
      start: eachEvent.start.date
      })
    );
    debugger
    return formated_events
  }
)
