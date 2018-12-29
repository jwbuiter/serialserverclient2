const { RECEIVE_IP, RECEIVE_TIME, TOGGLE_MENU } = require("../actions/types");

const initialState = {
  ip: "",
  time: new Date().getTime(),
  isMenuOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_IP: {
      return {
        ...state,
        ip: action.payload
      };
    }
    case RECEIVE_TIME: {
      return {
        ...state,
        time: action.payload
      };
    }
    case TOGGLE_MENU: {
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    }
    default:
      return state;
  }
};
