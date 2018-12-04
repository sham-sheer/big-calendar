import React, { Component } from 'react';
import Root from './containers/Root';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import CalendarEventForm from './calendar-event-form';
import Calendar from './react-calendar-view';
import moment from 'moment';



class CalendarContainer extends Component {
  state = {
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
    ]
  };

  updateEventsList = (event) => {
      this.setState({
        events: [
          ...this.state.events,
          {
            allDay: false,
            end: new Date(event.endParsed),
            start: new Date(event.startParsed),
            title: event.title,
          },
        ],
      })
  }

  getEventsFromMove = (events) => {
    this.setState({
      events: events
    })
  }

  render() {
    return (
      <div className="calendar-container">
        <Router>
          <Switch>
            <Route
              exact path="/"
              render={(props) =>
                <Calendar
                  {...props}
                  eventsList={this.state.events}
                  pushEventsFromMove={this.getEventsFromMove}
                  pushEventsFromResize={this.getEventsFromResize}
                />}
            />
            <Route
               path="/:start/:end"
               render={(props) =>
                 <CalendarEventForm
                    {...props}
                    updateEvents={this.updateEventsList}
                 />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default CalendarContainer;
