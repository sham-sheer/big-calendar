import rootReducer from '../newReducers';
import { createStore, applyMiddleware, compose } from 'redux';
import { storeEventsMiddleware,
         apiSuccessToDbMiddleware,
         eventsStoreOutMiddleware
       }
from '../middleware/db/events';
import { authBeginMiddleware,
         authSuccessMiddleware
       }
from '../middleware/auth';
import { eventsMiddleware
       }
from '../middleware/events';
import { loggerMiddleware } from '../middleware/logger'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(
                                                                               authBeginMiddleware,
                                                                               authSuccessMiddleware,                                                                             
                                                                               eventsStoreOutMiddleware,
                                                                               eventsMiddleware,
                                                                               apiSuccessToDbMiddleware,
                                                                               storeEventsMiddleware,
                                                                               loggerMiddleware)));
