import React, { Component } from "react";
import { connect } from "react-redux";
import FitText from "react-fittext";
import Modal from "react-modal";
import classNames from "classnames";

import { makeForm } from "../helpers";
import "../styles/comElement.scss";

const configurationValues = {
  serial: {
    coms: [
      {
        testMessage: {
          name: "Test value",
          type: "text",
          condition: config => config.serial.testMode
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
    this.state = {
      configModalIsOpen: false,
      showHistory: false,
      comIndex: -1
    };
  }

  openConfigModal = index => {
    this.setState({ configModalIsOpen: true, comIndex: index });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  toggleShowHistory = () => {
    this.setState({ showHistory: !this.state.showHistory });
  };

  render() {
    const coms = this.props.coms
      .map((com, index) => ({ index, ...com }))
      .filter(com => com.name || !this.props.configLocked);

    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Serial Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form onChange={this.props.api.changeConfig}>
              <h2>Configuration for com{this.state.comIndex}</h2>
              {makeForm(
                configurationValues,
                this.props.config,
                this.state.comIndex
              )}
            </form>
          )}
        </Modal>
        {coms.map(com => (
          <div
            key={com.index}
            className={classNames("comElement", {
              "comElement--wide": coms.length === 1
            })}
            onClick={
              this.props.configLocked
                ? () => this.toggleShowHistory()
                : () => this.openConfigModal(com.index)
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
              {this.state.showHistory ? (
                <div className="comElement--content--history">
                  {com.history
                    .slice(0, this.props.config.serial.coms[com.index].entries)
                    .map(element => (
                      <>
                        <div>{element.timeString}</div>
                        <div>{element.entry}</div>
                      </>
                    ))}
                </div>
              ) : (
                <div className="center">
                  <FitText compressor={0.9}>
                    <div>{com.entry}</div>
                  </FitText>
                </div>
              )}
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
