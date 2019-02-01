import ReactCalendarView from '../components/react-calendar-view';
import { withRouter } from 'react-router-dom';
import { updateEvents,
        getGoogleEvents,
        getOutlookEvents,
        beginGoogleAuth,
        beginGoogleLoad,
        beginGetGoogleCalendar
} from '../redux/actions';
import { connect } from 'react-redux';
import { getFilteredEvents } from '../redux/selectors';

const mapStateToProps = state => {
  return {
    events: getFilteredEvents(state)
  }
}

const mapDispatchToProps = dispatch => ({
  updateEvents: (nextEvents) => dispatch(updateEvents(nextEvents)),
  getGoogleEvents: () => dispatch(getGoogleEvents()),
  beginGetGoogleCalendar: () => dispatch(beginGetGoogleCalendar()),
  beginGoogleAuth: () => dispatch(beginGoogleAuth()),
  //getOutlookEvents: (url) => dispatch(getOutlookEvents(url)),
  //beginGoogleLoad: () => dispatch(beginGoogleLoad()),

})



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReactCalendarView));
