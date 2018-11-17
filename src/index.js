import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import App from "./App";
import reducer from "./reducers/rootReducer";
import api from "./api";
import * as serviceWorker from "./serviceWorker";
import "./styles/global.scss";

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App api={api(store)} />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
