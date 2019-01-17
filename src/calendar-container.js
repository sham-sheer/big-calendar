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
  render() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(eventsReducer, composeEnhancers(applyMiddleware(loggerMiddleware)));
    return (
      <div className="calendar-container">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={ReactCalendarView} />
            <Route path="/:start/:end" component={CalendarEventForm} />
          </Switch>
        </Router>
        </Provider>
      </div>
    );
  }
}

export default CalendarContainer
