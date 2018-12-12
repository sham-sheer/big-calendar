import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import CalendarEventForm from './calendar-event-form';
import ReactCalendarView from './react-calendar-view';
import moment from 'moment';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import eventsReducer from './redux/reducers';
import { loggerMiddleware } from './redux/middleware';


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
        end: new Date('December 05, 2018 11:13:00'),
        start: new Date('December 05, 2018 11:13:00'),
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
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(eventsReducer, composeEnhancers(applyMiddleware(loggerMiddleware)));

    return (
      <div className="calendar-container">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route
              exact path="/"
              render={(props) =>
                <ReactCalendarView
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
        </Provider>
      </div>
    );
  }
}

export default CalendarContainer
