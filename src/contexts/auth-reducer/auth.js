// action - state management
import { REGISTER, LOGIN, LOGOUT } from './actions';

// initial state
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  menu: []
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user, menu } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        menu
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        menu: []
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
