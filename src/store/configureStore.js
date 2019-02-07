import rootReducer from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import { apiMiddleware, loggerMiddleware, dbMiddleware } from '../redux/middleware';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(apiMiddleware, dbMiddleware, loggerMiddleware)));
