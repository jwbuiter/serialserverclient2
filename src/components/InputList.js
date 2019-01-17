import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import FitText from "react-fittext";

import { makeForm } from "../configHelper";
import "../styles/inputList.scss";

Modal.setAppElement("#root");

const configurationValues = {
  input: {
    ports: [
      {
        name: {
          name: "Name of cell",
          type: "text"
        },
        formula: {
          name: "Command for input",
          type: "select",
          options: {
            "": "",
            exe: "Execute",
            exebl: "Execute Block",
            teach: "SL Teach",
            restart: "Restart",
            shutdown: "Shutdown"
          }
        },
        invert: {
          name: "Invert follow",
          type: "checkbox"
        },
        follow: {
          name: "Follow output",
          type: "select",
          options: {
            "-1": "None",
            "0": "Follow 0"
          }
        },
        timeout: {
          name: "Debounce timeout in milliseconds",
          type: "number",
          min: 0,
          step: 1
        },
        manualTimeout: {
          name: "Manual timeout in seconds",
          type: "number",
          min: 0,
          step: 1
        }
      }
    ]
  }
};

class InputList extends Component {
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
          contentLabel="Input Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form onChange={this.props.api.changeConfig}>
              <h2>Configuration for input {this.state.configPortIndex + 1}</h2>
              {makeForm(
                configurationValues,
                this.props.config,
                this.state.configPortIndex
              )}
            </form>
          )}
        </Modal>
        <div className="buttonList inputList">
          <div className="buttonList--title">
            <div className="center">
              <FitText>
                <div>Inputs</div>
              </FitText>
            </div>
          </div>
          {this.props.inputs
            .map((port, index) => ({ ...port, index }))
            .filter((port, index) => {
              return (
                this.props.portsEnabled[index] ||
                port.name !== "" ||
                !this.props.configLocked
              );
            })
            .map(port => {
              let indicator = "buttonList--list--indicator--input";
              if (port.isForced) indicator += "Forced";

              indicator += port.state ? "On" : "Off";

              return (
                <div
                  key={port.index}
                  className="buttonList--list--item"
                  onClick={
                    this.props.configLocked
                      ? () => this.props.api.forceInput(port.index)
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
  const inputs = state.internal.inputs.map((input, index) => ({
    ...input,
    name: state.config.input.ports[index].name
  }));

  const configLocked = state.config.locked;
  const config = state.config;

  const portsEnabled = state.config.input.ports.map(
    port => port.formula !== ""
  );

  return {
    inputs,
    configLocked,
    config,
    portsEnabled
  };
}

export default connect(mapStateToProps)(InputList);
