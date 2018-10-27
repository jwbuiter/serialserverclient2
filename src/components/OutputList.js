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
        { state: false, forced: false, name: "separator" }
      ]
    };
  }
  render() {
    return (
      <div className="outputList">
        <div className="outputList--title">
          <div className="center">uitgangen voor poorten</div>
        </div>
        <ul className="outputList--list">
          {this.state.ports.map(port => {
            let indicator = "outputList--list--indicator--";
            if (port.forced) indicator += "forced";

            indicator += port.state ? "on" : "off";

            return (
              <li className="outputList--list--item">
                {port.name}
                <div className={"outputList--list--indicator " + indicator} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default OutputList;
