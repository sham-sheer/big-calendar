import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../routes';

const Root = () => ( // Use HashRouter for edison app
    <Router>
      <Routes />
    </Router>
);

export default Root;
