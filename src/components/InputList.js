import React, { Component } from "react";
import { connect } from "react-redux";

import "../styles/inputList.scss";

class InputList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="buttonList inputList">
        <div className="buttonList--title">
          <div className="center-vertical">inputs</div>
        </div>
        {this.props.inputs
          .filter((port, index) => {
            return this.props.portsEnabled[index] || port.name !== "";
          })
          .map((port, index) => {
            let indicator = "buttonList--list--indicator--input";
            if (port.isForced) indicator += "Forced";

            indicator += port.state ? "On" : "Off";

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

  const portsEnabled = state.config.input.ports.map(
    port => port.formula !== ""
  );

  return {
    configLocked,
    portsEnabled
  };
}

export default connect(mapStateToProps)(InputList);
