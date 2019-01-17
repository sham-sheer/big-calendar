import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
import { updateEvents, getEvents } from './redux/actions';
import { connect } from 'react-redux';
import './react-calendar-view.css';

const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const CALENDAR_ID = 'shamsheer619@gmail.com';
const CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const SCOPE = `https://www.googleapis.com/auth/calendar.events`;

var GoogleAuth;


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class ReactCalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: '',
      isShowEvent: false,
      currentEventStartDateTime: ''
    };
  }

  componentWillMount() {
    Modal.setAppElement('body');

  }

  componentDidMount() {
    handleClientLoad();
  }

  moveEventList = ({ event, start, end }) => {
      const events = this.props.events;

      const idx = events.indexOf(event);
      const updatedEvent = { ...event, start, end };

      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);
      this.props.updateEvents(nextEvents);
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const events = this.props.events;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    this.props.updateEvents(nextEvents);
  }

  handleSelectDate = ({ start, end }) => {
    this.props.history.push(`/${start}/$${end}`);
  }

  handleEventClick = (event) => {
    this.setState({
      isShowEvent: true,
      currentEvent: event,
      currentEventStartDateTime: moment(event.start).format("D, MMMM YYYY, h:mm a"),
      currentEventEndDateTime: moment(event.end).format("D, MMMM Do YYYY, h:mm a"),
    })
  }

  close = () => {
    this.setState({
      isShowEvent: false
    })
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  }

  render() {
    return (
      <>
      <Modal
          isOpen={this.state.isShowEvent}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.close}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.currentEvent.title}</h2>
          <h4>{this.state.currentEventStartDateTime} - {this.state.currentEventEndDateTime}</h4>
          <button onClick={this.close}>close</button>
        </Modal>
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.props.events}
        onEventDrop={this.moveEventList}
        onEventResize={this.resizeEvent}
        onSelectSlot={this.handleSelectDate}
        onSelectEvent={(event) => this.handleEventClick(event)}
        popup
        resizable
      />
      </>
    );
  }
}

function initClient() {
  window.gapi.client.init({
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPE,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  }).then(function () {
      GoogleAuth = window.gapi.auth2.getAuthInstance();
      handleAuthClick();
      // Handle initial sign-in state. (Determine if user is already signed in)
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
      setSigninStatus();
  })
}



function revokeAccess() {
  GoogleAuth.disconnect();
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
  } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    console.log("Authorized");
    makeApiCall();
  } else {
    console.log("Not authorized");
  }
}

const pageToken = null;

function makeApiCall() {
  return window.gapi.client.request({
        'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
      }).then(resp => {
        debugger
      let events = resp.result.items;
      console.log(events);
    }, (reason) => {
      console.log(reason);
    });
}


function handleClientLoad() {
  window.gapi.load('client:auth2', initClient);
}

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}



const mapDispatchToProps = dispatch => ({
  updateEvents: (nextEvents) => dispatch(updateEvents(nextEvents)),
  getEvents: () => dispatch(getEvents())

})



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReactCalendarView));
