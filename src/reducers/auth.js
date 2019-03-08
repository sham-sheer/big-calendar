import * as AuthActionTypes from '../actions/auth';
import * as ProviderTypes from '../utils/constants';

const initialState = {
  providers: {
    'GOOGLE': [],
    'OUTLOOK': [],
  },
  expiredProviders: {
    'GOOGLE': [],
    'OUTLOOK': [],
  },
  isAuth: false,
  currentUser: null       // currentUser is here bcuz of google auth. Not sure how to append it over yet. 
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthActionTypes.BEGIN_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: action.payload.user});
    case AuthActionTypes.FAIL_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});

    case AuthActionTypes.BEGIN_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null});
    case AuthActionTypes.SUCCESS_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, 
        providers: {
          'GOOGLE': state.providers[ProviderTypes.GOOGLE],
          'OUTLOOK': state.providers[ProviderTypes.OUTLOOK].concat(action.payload.user) 
        },
        expiredProviders: {
          'GOOGLE': state.providers[ProviderTypes.GOOGLE],
          'OUTLOOK': state.providers[ProviderTypes.OUTLOOK].filter(user => user.originalId !== action.payload.user.originalId) 
        }});
      // return Object.assign({}, state, {isAuth: false, currentUser: action.payload.user});
    case AuthActionTypes.FAIL_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: null});
    case AuthActionTypes.EXPIRED_OUTLOOK_AUTH:
      return Object.assign({}, state, {isAuth: false, expiredProviders: {
        'GOOGLE': state.providers[ProviderTypes.GOOGLE],
        'OUTLOOK': state.providers[ProviderTypes.OUTLOOK].concat(action.payload.user) 
      }});
    default:
      return state;
  }
}
