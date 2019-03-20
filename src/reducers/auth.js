import * as AuthActionTypes from '../actions/auth';


const initialState = {
  isAuth: false,
  currentUser: null
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthActionTypes.BEGIN_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: action.payload});
    case AuthActionTypes.FAIL_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});
    case AuthActionTypes.BEGIN_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: action.payloadß});
    case AuthActionTypes.FAIL_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});
    default:
      return state;
  }
}
