import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import IssuesContainer from './Containers/IssuesContainer';
import IssueDescription from './Containers/IssueDescription';
import IssueLogin from './Components/IssueLogin';
import IssueOAuth from './Containers/IssueOAuth';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import { apiMiddleware, loggerMiddleware } from './redux/middleware';



class App extends Component {

  render() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(apiMiddleware, loggerMiddleware)));
    return (
      <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route path={"/callback"} component={IssueOAuth} />
          <Route exact path={"/login"} component={IssueLogin} />
          <Route exact path={"/home"} render={(props) => <IssuesContainer {...props} />} />
          <Route exact path={"/:org/:repo/:id"} component={IssueDescription} />
        </div>
       </BrowserRouter>
       </Provider>
    );
  }
}

export default App;
