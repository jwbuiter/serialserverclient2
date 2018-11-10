import React, { Component } from "react";
import "../styles/inputList.scss";

class InputList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ports: [
        { state: false, forced: false, name: "blokkering" },
        { state: false, forced: false, name: "ingang 1" },
        { state: false, forced: false, name: "ingang 2" },
        { state: false, forced: false, name: "ingang 2" },
        { state: false, forced: false, name: "opslaan" }
      ]
    };
  }
  render() {
    return (
      <div className="buttonList inputList">
        <div className="buttonList--title">
          <div className="center-vertical">ingangen</div>
        </div>
        {this.state.ports.map(port => {
          let indicator = "buttonList--list--indicator--input";
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

export default InputList;
