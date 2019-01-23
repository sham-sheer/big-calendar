import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import CalendarEventForm from './event-form-container';
import ViewContainer from './view-container';
import OutLookRedirect from '../components/outlook-redirect';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import eventsReducer from '../redux/reducers';
import { apiMiddleware, loggerMiddleware } from '../redux/middleware';
import {store} from '../store/configureStore';


class CalendarContainer extends Component {
  render() {
    return (
      <div className="calendar-container">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path={"/outlook-redirect"} component={OutLookRedirect} />
            <Route exact path="/" component={ViewContainer} />
            <Route path="/:start/:end" component={CalendarEventForm} />
          </Switch>
        </Router>
        </Provider>
      </div>
    );
  }
}

export default CalendarContainer
