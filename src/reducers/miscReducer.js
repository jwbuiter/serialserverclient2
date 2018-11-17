const { RECEIVE_IP, RECEIVE_TIME } = require("../actions/types");

const initialState = {
  ip: "",
  time: new Date().getTime()
};

module.exports = function(state = initialState, action) {
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
    default:
      return state;
  }
};
