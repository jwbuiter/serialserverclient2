import React, { Component } from "react";
import { connect } from "react-redux";
import FitText from "react-fittext";
import Modal from "react-modal";
import classNames from "classnames";

import { makeForm } from "../configHelper";
import "../styles/comElement.scss";

const configurationValues = {
  serial: {
    coms: [
      {
        testMessage: {
          name: "Test value",
          type: "text"
        },
        reader: {
          name: "MBDC Reader",
          type: "checkbox"
        },
        baudRate: {
          name: "Baudrate/Port",
          type: "number",
          min: 0,
          step: 1
        },
        stopBits: {
          name: "Number of stop bits",
          type: "number",
          min: 0,
          step: 1
        },
        bits: {
          name: "Number of data bits",
          type: "number",
          min: 0,
          step: 1
        },
        parity: {
          name: "Parity of data",
          type: "select",
          options: {
            none: "None",
            even: "Even",
            odd: "Odd",
            mark: "Mark",
            space: "Space"
          }
        },
        RTSCTS: {
          name: "RTS/CTS",
          type: "checkbox"
        },
        XONXOFF: {
          name: "XON/XOFF",
          type: "checkbox"
        },
        name: {
          name: "Name of port",
          type: "text"
        },
        entries: {
          name: "Number of entries",
          type: "number",
          min: 0,
          step: 1
        },
        numeric: {
          name: "Treat value as number",
          type: "checkbox"
        },
        average: {
          name: "Take average",
          type: "checkbox"
        },
        factor: {
          name: "Factor",
          type: "number"
        },
        digits: {
          name: "Digits/rounding",
          type: "number",
          min: 0,
          step: 1
        },
        alwaysPositive: {
          name: "Always positive",
          type: "checkbox"
        },
        timeoutReset: {
          name: "Reset after timeout",
          type: "checkbox"
        },
        timeout: {
          name: "Timeout in seconds",
          type: "number",
          min: 0,
          step: 1
        },
        prefix: {
          name: "Prefix",
          type: "text"
        },
        postfix: { name: "Suffix", type: "text" }
      }
    ]
  }
};

class ComList extends Component {
  constructor(props) {
    super(props);
    this.state = { configModalIsOpen: false, configComIndex: -1 };
  }

  openConfigModal = index => {
    this.setState({ configModalIsOpen: true, configComIndex: index });
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
          contentLabel="Table Configuration Modal"
        >
          <form onChange={this.props.api.changeConfig}>
            <h2>Configuration for com{this.state.configComIndex}</h2>
            {makeForm(
              configurationValues,
              this.props.config,
              this.state.configComIndex
            )}
          </form>
        </Modal>
        {this.props.coms.map((com, index) => (
          <div
            className="comElement"
            onClick={
              this.props.configLocked ? null : () => this.openConfigModal(index)
            }
          >
            <div className="comElement--title">
              <div className="center">
                <FitText>
                  <div>{com.name}</div>
                </FitText>
                <FitText compressor={2}>
                  <div>{com.average && `Average ${com.entries}`}</div>
                </FitText>
              </div>
            </div>
            <div
              className={classNames("comElement--content", {
                "comElement--content--testMode": this.props.testMode
              })}
            >
              <div className="center">
                <FitText compressor={0.9}>
                  <div>{com.entry}</div>
                </FitText>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}

function mapStateToProps(state) {
  const coms = state.internal.coms.map((com, index) => ({
    ...com,
    ...state.config.serial.coms[index]
  }));

  return {
    coms,
    configLocked: state.config.locked,
    config: state.config,
    testMode: state.config.serial.testMode
  };
}

export default connect(mapStateToProps)(ComList);
