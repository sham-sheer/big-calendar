import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import './react-calendar-view.css';

const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const GOOGLE_CLIENT_ID = '65724758895-gc7lubjkjsqqddfhlb7jcme80i3mjqn0.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCTYXWtoRKnXeZkPCcZwYOXm0Qz3Lz9F9g';
const GOOGLE_SCOPE = `https://www.googleapis.com/auth/calendar.events`;
const OUTLOOK_CLIENT_ID = '6b770a68-2156-4345-b0aa-d95419e31be1';
const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
const OUTLOOK_SCOPE = 'openid profile Calendars.ReadWrite.Shared';
const PARAMS_URL = `response_type=id_token+token&client_id=${OUTLOOK_CLIENT_ID}
                    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foutlook-redirect
                    &scope=${OUTLOOK_SCOPE}&state=f175f48d-d277-9893-9c8d-dcc2a95ffe16
                    &nonce=593a2b06-d77b-31c2-ae43-e74c0ebeb304
                    &response_mode=fragment`

let GoogleAuth;


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
      currentEventStartDateTime: '',
      currentEventEndDateTime: ''
    };
  }

  componentWillMount() {
    // For the modal third party library
    Modal.setAppElement('body');
  }

  componentDidMount() {
    if(window.localStorage.getItem('at')) {
      this.props.getOutlookEvents();
    }
  }

  // Google OAuth Functions

  handleGoogleClientLoad = () => {
    window.gapi.load('client:auth2', this.initClient);
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
        GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
        this.setSigninStatus();
    })
  }

  handleAuthClick = () => {
    if (GoogleAuth.isSignedIn.get()) {
        GoogleAuth.signOut();
    } else {
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

  revokeAccess = () => {
    GoogleAuth.disconnect();
  }



  // Outlook OAuth Functions

  authorizeOutLookCodeRequest = () => {
    return BASE_URL + PARAMS_URL;
  }


  // Calendar Event Functions

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

  closeModal = () => {
    this.setState({
      isShowEvent: false
    })
  }


  /* Render functions */

  renderCalendar = () => {
    return (
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
    )
  }
  renderEventPopup = () => {
    return (
      <Modal
       isOpen={this.state.isShowEvent}
       onAfterOpen={this.afterOpenModal}
       onRequestClose={this.closeModal}
       style={customStyles}
       contentLabel="Event Modal" >
        <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.currentEvent.title}</h2>
        <h4>{this.state.currentEventStartDateTime} - {this.state.currentEventEndDateTime}</h4>
        <button onClick={this.close}>close</button>
      </Modal>
    )
  }

  renderSignupLinks = () => {
    return (
      <div>
         <a href={this.authorizeOutLookCodeRequest()}>
          <button className="btn btn-block btn-social">
            <span className="fa fa-outlook"></span>
              Sign in with Outlook
            </button>
          </a>
          <button className="btn btn-block btn-social"
                  onClick={this.handleGoogleClientLoad}>
            <span className="fa fa-google"></span>
              Sign in with Google
          </button>
      </div>
    )
  }

  render() {
    return (
      <>
      {this.renderSignupLinks()}
      {this.renderEventPopup()}
      {this.renderCalendar()}
      </>
    );
  }
}
