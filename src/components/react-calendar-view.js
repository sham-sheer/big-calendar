import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import './react-calendar-view.css';
import queryString from 'query-string';

const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;
const OUTLOOK_SECRET = 'nqitvIH4666}agYYARW5{@^';
const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
const REDIRECT_URL = 'http://localhost:3000/outlook-redirect'
const OUTLOOK_SCOPE = 'openid profile Calendars.ReadWrite.Shared';
const PARAMS_URL = `response_type=id_token+token&client_id=${OUTLOOK_CLIENT_ID}
                    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foutlook-redirect
                    &scope=${OUTLOOK_SCOPE}&state=f175f48d-d277-9893-9c8d-dcc2a95ffe16
                    &nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304
                    &response_mode=fragment`

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

export default class ReactCalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: '',
      isShowEvent: false,
      currentEventStartDateTime: ''
    };
  }

  initClient = () => {
    window.gapi.client.init({
        'apiKey': API_KEY,
        'clientId': GOOGLE_CLIENT_ID,
        'scope': GOOGLE_SCOPE,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    }).then( () => {
        GoogleAuth = window.gapi.auth2.getAuthInstance();
        this.handleAuthClick();
        // Handle initial sign-in state. (Determine if user is already signed in)
        GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
        this.setSigninStatus();
    })
  }



  revokeAccess = () => {
    GoogleAuth.disconnect();
  }

  handleAuthClick = () => {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
      }
  }

  updateSigninStatus = (isSignedIn) => {
    this.setSigninStatus();
  }

  setSigninStatus = () => {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPE);
    if (isAuthorized) {
      console.log("Authorized");
      this.props.getGoogleEvents();
    } else {
      console.log("Not authorized");
    }
  }


  handleGoogleClientLoad = () => {
    window.gapi.load('client:auth2', this.initClient);
  }

  authorizeOutLookCodeRequest = () => {
    const url = BASE_URL + PARAMS_URL;
    return url;
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount() {
    if(window.localStorage.getItem('at')) {
      this.props.getOutlookEvents();
    }
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
    const query = this.authorizeOutLookCodeRequest();
    return (
      <>
      <div>
          <a className="btn btn-block btn-social btn-github" href={`${query}`}>
            <span className="fa fa-outlook"></span>
              Sign in with Outlook
            </a>
      </div>
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
