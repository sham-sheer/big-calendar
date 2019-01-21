import ReactCalendarView from '../components/react-calendar-view';
import { withRouter } from 'react-router-dom';
import { updateEvents, getGoogleEvents, getOutlookEvents } from '../redux/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

const mapDispatchToProps = dispatch => ({
  updateEvents: (nextEvents) => dispatch(updateEvents(nextEvents)),
  getGoogleEvents: () => dispatch(getGoogleEvents()),
  getOutlookEvents: (url) => dispatch(getOutlookEvents(url))
})



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReactCalendarView));
