import rootReducer from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
// import { storeEventsMiddleware,
//   apiSuccessToDbMiddleware,
//   eventsStoreOutMiddleware
// }
//   from '../middleware/db/events';
import { authBeginMiddleware,
  authSuccessMiddleware
}
  from '../middleware/auth';
// import { eventsMiddleware
// }
//   from '../middleware/events';
import { loggerMiddleware } from '../middleware/logger';

import { rootEpic } from '../epics';
import { createEpicMiddleware } from 'redux-observable';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(
  authBeginMiddleware,
  authSuccessMiddleware,
  epicMiddleware,
  loggerMiddleware)));

epicMiddleware.run(rootEpic);
