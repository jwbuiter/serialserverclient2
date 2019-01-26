import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import FitText from "react-fittext";

import { makeForm } from "../helpers";
import "../styles/outputList.scss";

Modal.setAppElement("#root");

const configurationValues = {
  output: {
    ports: [
      {
        name: {
          name: "Name of output",
          type: "text"
        },
        formula: {
          name: "Formula for output",
          type: "text"
        },
        execute: {
          name: "Only on execute",
          type: "checkbox"
        },
        timeout: {
          name: "Timeout in seconds",
          type: "number",
          min: 0,
          step: 1
        }
      }
    ]
  }
};

class OutputList extends Component {
  constructor(props) {
    super(props);
    this.state = { configModalIsOpen: false, configPortIndex: -1 };
  }

  openConfigModal = index => {
    this.setState({ configModalIsOpen: true, configPortIndex: index });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Output Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form onChange={this.props.api.changeConfig}>
              <h2>Configuration for output {this.state.configPortIndex + 1}</h2>
              {makeForm(
                configurationValues,
                this.props.config,
                this.state.configPortIndex
              )}
            </form>
          )}
        </Modal>
        <div className="buttonList">
          <div className="buttonList--title">
            <div className="center">
              <FitText>
                <div>Outputs</div>
              </FitText>
            </div>
          </div>
          {this.props.outputs
            .map((port, index) => ({ ...port, index }))
            .filter((port, index) => {
              return (
                this.props.portsEnabled[index] ||
                port.name !== "" ||
                !this.props.configLocked
              );
            })
            .map(port => {
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
                  key={port.index}
                  className="buttonList--list--item"
                  onClick={
                    this.props.configLocked
                      ? () => this.props.api.forceOutput(port.index)
                      : () => this.openConfigModal(port.index)
                  }
                >
                  <div className={"buttonList--list--indicator " + indicator}>
                    <div className="center">
                      <FitText compressor={1.05}>
                        <div>{port.name}</div>
                      </FitText>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const outputs = state.internal.outputs.map((output, index) => ({
    ...output,
    name: state.config.output.ports[index].name
  }));

  const configLocked = state.config.locked;
  const config = state.config;

  const portsEnabled = state.config.output.ports.map(
    port => port.formula !== ""
  );

  return {
    outputs,
    configLocked,
    config,
    portsEnabled
  };
}

export default connect(mapStateToProps)(OutputList);
