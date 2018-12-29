import React, { Component } from "react";
import { connect } from "react-redux";

import "../styles/outputList.scss";

class OutputList extends Component {
  render() {
    return (
      <div className="buttonList">
        <div className="buttonList--title">
          <div className="center-vertical">outputs</div>
        </div>
        {this.props.outputs
          .filter((port, index) => {
            return this.props.portsEnabled[index] || port.name !== "";
          })
          .map((port, index) => {
            let indicator = "buttonList--list--indicator--output";
            if (port.isForced) indicator += "Forced";

            if (port.state) {
              indicator += "On";
            } else if (port.result && !port.isForced) {
              indicator += "Execute";
            } else {
              indicator += "Off";
            }

            return (
              <div
                key={index}
                className="buttonList--list--item"
                onClick={() => this.props.clickFunction(index)}
              >
                <div className="center-vertical"> {port.name}</div>
                <div className={"buttonList--list--indicator " + indicator} />
              </div>
            );
          })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const configLocked = state.config.locked;

  const portsEnabled = state.config.output.ports.map(
    port => port.formula !== ""
  );

  return {
    configLocked,
    portsEnabled
  };
}

export default connect(mapStateToProps)(OutputList);
