const { createStore } = require("redux");
const rootReducer = require("./reducers/index");

const store = createStore(rootReducer);

module.exports = store;
