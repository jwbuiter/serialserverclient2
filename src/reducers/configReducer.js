const { RECEIVE_CONFIG } = require("../actions/types");

module.exports = function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_CONFIG: {
      return action.payload;
    }
    default:
      return state;
  }
};
