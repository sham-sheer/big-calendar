import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import './react-calendar-view.css';
import { withRouter } from 'react-router-dom';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';
import Modal from 'react-modal';


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
      currentEventStartDateTime: '',
      currentEventStartDateTime: ''
    };

    this.moveEvent = this.moveEvent.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  moveEvent({ event, start, end }) {
      const events = this.props.eventsList;

      const idx = events.indexOf(event);
      const updatedEvent = { ...event, start, end };

      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);


      this.props.pushEventsFromMove(nextEvents);
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const events = this.props.eventsList;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.props.pushEventsFromResize(nextEvents);
  };

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
      <div>
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
        events={this.props.eventsList}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        defaultView={BigCalendar.Views.DAY}
        onSelectSlot={this.handleSelectDate}
        onSelectEvent={(event) => this.handleEventClick(event)}
        popup
      />
      </div>
    );
  }
}

export default withRouter(ReactCalendarView);
