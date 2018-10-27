import React, { Component } from "react";
import ComElement from "./ComElement";
import OutputList from "./OutputList";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="page-wrap" class="main">
        <ComElement
          title="Gewogen gewicht"
          content={{ value: 20, unit: "kg", comment: "" }}
        />
        <ComElement
          title="EID nummer"
          content={{ value: "0987654321", unit: "", comment: "E-nummer" }}
        />
        <OutputList />
      </div>
    );
  }
}

export default Main;
