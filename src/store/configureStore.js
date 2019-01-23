import eventsReducer from '../redux/reducers';

import { createStore, applyMiddleware, compose } from 'redux';
import { apiMiddleware, loggerMiddleware } from '../redux/middleware';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(eventsReducer, composeEnhancers(applyMiddleware(apiMiddleware, loggerMiddleware)));
