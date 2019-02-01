import { BEGIN_GOOGLE_AUTH, SUCCESS_GOOGLE_AUTH } from '../redux/actions';


const initialState = {
  isAuth: false,
  currentUser: null
}

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case BEGIN_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: true, currentUser: null})
    case SUCCESS_GOOGLE_AUTH:
      return Object.assign({}, state, {isAuth: false, currentUser: action.payload})
    default:
      return state
  }
}
