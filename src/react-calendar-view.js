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
    this.props.getEvents();
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
