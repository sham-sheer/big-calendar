import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import './react-calendar-view.css';
import getDb from '../db';

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

export default class ReactCalendarView extends React.Component {
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

  /*async componentDidMount() {
    const db = await getDb();
    this.props.beginGoogleAuth();
    db.events.insert$.subscribe(changeEvent => console.dir(changeEvent));
    if(!this.props.initialSync) {
      this.performSync(db);
    }
    //this.incrementalSync = setInterval(() => this.props.beginGetGoogleEvents(), 10000);
  }*/

  componentDidMount() {
    this.props.beginGoogleAuth();
  }

  componentWillUnmount() {
    clearInterval(this.incrementalSync);
    this.incrementalSync = null;
  }

  performSync = (db) => {
    this.initialSync(db).then((data) => {
      if(data.length > 0) {
        this.props.updateEvents(data);
      }
    });
  }


 initialSync = async (db) => {
    let data = [];
    await db.events.find().exec().then(events => {
        data = events.map(singleEvent => {
          return {
            id: singleEvent.id,
            end: singleEvent.end,
            start: singleEvent.start,
            summary: singleEvent.summary,
          }
        });
      });
    return data;
  }

  // Outlook OAuth Functions

  authorizeOutLookCodeRequest = () => {
    //return BASE_URL + PARAMS_URL;
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
                  onClick={() => this.props.beginGetGoogleEvents()}>
            <span className="fa fa-google"></span>
              Get Google Events
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
