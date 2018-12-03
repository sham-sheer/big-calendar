import React from "react";
import { DragDropContext } from "react-dnd";
import BigCalendar from "react-big-calendar";
import HTML5Backend from "react-dnd-html5-backend";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import './react-calendar-view.css';
import { withRouter } from 'react-router-dom';


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
      const { events } = this.props;

      const idx = events.indexOf(event);
      const updatedEvent = { ...event, start, end };

      const nextEvents = [...events];
      nextEvents.splice(idx, 1, updatedEvent);


      this.props.pushEventsFromMove(nextEvents);
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const { events } = this.props;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    this.props.pushEventsFromResize(nextEvents);
    this.setState({
      events: nextEvents
    });
  };

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }

  handleSelectDate = ({ start, end }) => {
    this.props.history.push(`/${start}/$${end}`);
  }

  render() {
    debugger
    return (
      <DragAndDropCalendar
        className="react-calendar-view"
        selectable
        localizer={localizer}
        events={this.props.eventsList}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        defaultView={BigCalendar.Views.DAY}
        onSelectSlot={this.handleSelectDate}
        popup
      />
    );
  }
}

const Calendar = DragDropContext(HTML5Backend)(ReactCalendarView);

export default withRouter(Calendar);
