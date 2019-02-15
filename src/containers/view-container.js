import ReactCalendarView from '../components/react-calendar-view';
import { withRouter } from 'react-router-dom';
import { updateEvents,
        //beginGetGoogleEvents,
        //getOutlookEvents,
        //beginGoogleAuth,
        getGoogleCalendarListBegin
} from '../redux/actions';
import {
  beginGoogleAuth,
} from '../actions/auth';
import {
  retrieveStoreEvents
} from '../actions/db/events';
import {
  beginGetGoogleEvents
} from '../actions/events';
import { connect } from 'react-redux';
import { getFilteredEvents } from '../redux/selectors';

const mapStateToProps = state => {
  return {
    events: getFilteredEvents(state),
    initialSync: state.events.initialSync,
    isAuth: state.auth.currentUser
  }
}

const mapDispatchToProps = dispatch => ({
  updateEvents: (nextEvents) => dispatch(updateEvents(nextEvents)),
  beginGetGoogleEvents: () => dispatch(beginGetGoogleEvents()),
  beginGoogleAuth: () => dispatch(beginGoogleAuth()),
  getGoogleCalendarListBegin: () => dispatch(getGoogleCalendarListBegin()),
  retrieveStoreEvents: () => dispatch(retrieveStoreEvents())
  //getOutlookEvents: (url) => dispatch(getOutlookEvents(url)),

})



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReactCalendarView));
