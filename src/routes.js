import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import CalendarEventForm from './calendar-event-form';
import Calendar from './react-calendar-view';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={Calendar} />
      <Route path="/:start/:end" component={CalendarEventForm} />
    </Switch>
  </App>
);
