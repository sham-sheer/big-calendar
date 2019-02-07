import ReactCalendarView from '../components/react-calendar-view';
import { withRouter } from 'react-router-dom';
import { updateEvents,
        beginGetGoogleEvents,
        //getOutlookEvents,
        beginGoogleAuth,
        beginGetGoogleCalendar
} from '../redux/actions';
import { connect } from 'react-redux';
import { getFilteredEvents } from '../redux/selectors';

const mapStateToProps = state => {
  return {
    events: getFilteredEvents(state),
    initialSync: state.events.initialSync
  }
}

const mapDispatchToProps = dispatch => ({
  updateEvents: (nextEvents) => dispatch(updateEvents(nextEvents)),
  beginGetGoogleEvents: () => dispatch(beginGetGoogleEvents()),
  beginGetGoogleCalendar: () => dispatch(beginGetGoogleCalendar()),
  beginGoogleAuth: () => dispatch(beginGoogleAuth()),
  //getOutlookEvents: (url) => dispatch(getOutlookEvents(url)),

})



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReactCalendarView));
