import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import './view.css';


const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

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

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: [{}] ,
      isShowEvent: false,
      currentEventStartDateTime: '',
      currentEventEndDateTime: ''
    };
    let incrementalSync;
  }

  componentWillMount() {
    // For the modal third party library
    Modal.setAppElement('body');
  }
  componentDidMount() {
    // this.props.beginGoogleAuth();
    // this.props.beginOutlookAuth();
  }

  componentWillUnmount() {
    clearInterval(this.incrementalSync);
    this.incrementalSync = null;
  }

  // Outlook OAuth Functions

  authorizeOutLookCodeRequest = () => {
    this.props.beginOutlookAuth();
    //return BASE_URL + PARAMS_URL;
  }

  authorizeGoogleCodeRequest = () => {
    this.props.beginGoogleAuth();
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

  editEvent = () => {
    this.props.history.push(`/${this.state.currentEvent.id}`)
  }

  handleEventClick = (event) => {
    this.setState({
      isShowEvent: true,
      currentEvent: event,
      currentEventStartDateTime: moment(event.start).format("D, MMMM YYYY, h:mm a"),
      currentEventEndDateTime: moment(event.end).format("D, MMMM Do YYYY, h:mm a"),
    });
  }

  closeModal = () => {
    this.setState({
      isShowEvent: false
    });
  }

  deleteEvent = () => {
    this.props.beginDeleteEvent(this.state.currentEvent.id);
    this.closeModal();
  }

  /* Render functions */

  renderCalendar = () => {
    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.props.events}
        views={{
          month: true,
          day: true,
        }}
        onEventDrop={this.moveEventList}
        onEventResize={this.resizeEvent}
        onSelectSlot={this.handleSelectDate}
        onSelectEvent={(event) => this.handleEventClick(event)}
        popup
        resizable
      />
    );
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
        <button onClick={this.closeModal}>Close</button>
        <button onClick={this.deleteEvent}>Delete</button>
        <button onClick={this.editEvent}>Edit</button>
      </Modal>
    );
  }

  renderSignupLinks = () => {
    return (
      <div>
      <a className="waves-effect waves-light btn"
          onClick={() => this.authorizeGoogleCodeRequest()}>
       <i className="material-icons left">cloud</i>Sign in with Google</a>
       <a className="waves-effect waves-light btn"
           onClick={() => this.authorizeOutLookCodeRequest()}>
        <i className="material-icons left">cloud</i>Sign in with Outlook</a>
        <a className="waves-effect waves-light btn"
            onClick={() => this.props.beginGetGoogleEvents()}>
         <i className="material-icons left">cloud_download</i>Get Google Events</a>
         <a className="waves-effect waves-light btn"
             onClick={() => this.props.beginGetOutlookEvents()}>
          <i className="material-icons left">cloud_download</i>Get Outlook Events</a>
          <a className="waves-effect waves-light btn"
              onClick={() => this.props.clearAllEvents()}>
           <i className="material-icons left">close</i>Clear all Events</a>
      </div>
    );
  }

  render() {
    if(this.props.isAuth !== undefined) {
      return (
        <>
        {this.renderSignupLinks()}
        {this.renderEventPopup()}
        {this.renderCalendar()}
        </>
      );
    }
    else {
      return (<div>Logging in...</div>);
    }
  }
}
