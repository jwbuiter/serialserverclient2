import React, { Component } from "react";
import "../styles/outputList.scss";

class OutputList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ports: [
        { state: true, forced: false, name: "poort in" },
        { state: false, forced: false, name: "poort uit" },
        { state: true, forced: true, name: "separator" },
        { state: false, forced: true, name: "separator" },
        { state: true, forced: false, name: "poort in" },
        { state: false, forced: false, name: "poort uit" },
        { state: true, forced: true, name: "separator" },
        { state: false, forced: true, name: "separator" },
        { state: true, forced: false, name: "poort in" },
        { state: false, forced: false, name: "poort uit" }
      ]
    };
  }
  render() {
    return (
      <div className="buttonList">
        <div className="buttonList--title">
          <div className="center-vertical">uitgangen voor poorten</div>
        </div>
        {this.state.ports.map(port => {
          let indicator = "buttonList--list--indicator--output";
          if (port.forced) indicator += "Forced";

          indicator += port.state ? "On" : "Off";

          return (
            <div className="buttonList--list--item">
              <div className="center-vertical"> {port.name}</div>
              <div className={"buttonList--list--indicator " + indicator} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default OutputList;
