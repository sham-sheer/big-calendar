import rootReducer from '../reducers';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware, compose } from 'redux';
import { apiMiddleware, loggerMiddleware, dbMiddleware } from '../redux/middleware';
import { rootEpic } from '../epics';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();



export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(apiMiddleware, dbMiddleware, loggerMiddleware)));

epicMiddleware.run(rootEpic);
