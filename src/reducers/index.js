const { combineReducers } = require("redux");
const configReducer = require("./configReducer");
const staticReducer = require("./staticReducer");
const stateReducer = require("./stateReducer");

module.exports = combineReducers({
  config: configReducer,
  static: staticReducer,
  state: stateReducer
});
