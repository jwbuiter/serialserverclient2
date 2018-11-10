import React, { Component } from "react";
import { Provider } from "react-redux";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div id="outer-container">
          <Sidebar />
          <Main />
        </div>
      </Provider>
    );
  }
}

export default App;
