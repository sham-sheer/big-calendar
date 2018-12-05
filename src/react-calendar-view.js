import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import './react-calendar-view.css';
import { withRouter } from 'react-router-dom';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'


const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class ReactCalendarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          allDay: false,
          end: new Date('December 10, 2018 11:13:00'),
          start: new Date('December 09, 2018 12:13:00'),
          title: 'hi',
        },
        {
          allDay: true,
          end: new Date('December 09, 2018 11:13:00'),
          start: new Date('December 09, 2018 11:13:00'),
          title: 'All Day Event',
        }
      ],
    };

    this.moveEvent = this.moveEvent.bind(this);
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

  handleEventClick = ({ event }) => {
    alert(event);
  }

  render() {
    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.props.eventsList}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        defaultView={BigCalendar.Views.MONTH}
        onSelectSlot={this.handleSelectDate}
        onSelectEvent={event => alert(event.title)}
      />
    );
  }
}

export default withRouter(ReactCalendarView);
