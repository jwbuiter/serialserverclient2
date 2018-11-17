import React, { Component } from "react";
import "../styles/outputList.scss";

class OutputList extends Component {
  render() {
    return (
      <div className="buttonList">
        <div className="buttonList--title">
          <div className="center-vertical">uitgangen voor poorten</div>
        </div>
        {this.props.outputs.map(port => {
          let indicator = "buttonList--list--indicator--output";
          if (port.isForced) indicator += "Forced";

          if (port.state) {
            indicator += "On";
          } else if (port.result) {
            indicator += "Execute";
          } else {
            indicator += "Off";
          }

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
