import React, { Component } from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <div id="outer-container">
        <Sidebar api={this.props.api} />
        <Main api={this.props.api} />
      </div>
    );
  }
}

export default App;
