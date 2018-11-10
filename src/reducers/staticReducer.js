const { RECEIVE_STATIC } = require("../actions/types");

module.exports = function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_STATIC: {
      return action.payload;
    }
    default:
      return state;
  }
};
