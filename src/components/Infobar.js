import React, { Component } from "react";
import FitText from "react-fittext";
import moment from "moment";
import { connect } from "react-redux";
import Modal from "react-modal";

import { makeForm } from "../configHelper";

import "../styles/infobar.scss";

Modal.setAppElement("#root");

const configurationValues = {
  serial: {
    title: {
      name: "Serial",
      type: "title"
    },
    testMode: { name: "Enable test mode", type: "checkbox" },
    resetTrigger: {
      name: "Reset on zero",
      type: "select",
      options: { off: "Off", on: "On", com0: "Com 0", com1: "Com 1" }
    }
  },
  table: {
    title: {
      name: "Table",
      type: "title"
    },
    trigger: {
      name: "Trigger",
      type: "select",
      options: { "0": "Com 0", "1": "Com 1" }
    },
    useFile: { name: "Use imported file", type: "checkbox" },
    waitForOther: { name: "Wait for other com", type: "checkbox" },
    searchColumn: {
      name: "Column to search in",
      type: "number",
      min: 0,
      step: 1
    }
  },
  logger: {
    title: {
      name: "Logger",
      type: "title"
    },
    writeToFile: {
      name: "Write log to file",
      type: "checkbox"
    },
    logID: {
      name: "ID of log",
      type: "text"
    },
    unique: {
      name: "Unique log type",
      type: "select",
      options: { off: "Off", com0: "Com 0", com1: "Com 1" }
    },
    resetMode: {
      name: "Reset mode:",
      type: "select",
      options: { off: "Off", time: "Time of day", interval: "Time interval" }
    },
    resetValue: {
      name: "Reset time",
      type: "time",
      condition: "logger.resetMode==='time'"
    }
  },
  FTP: {
    title: {
      name: "FTP",
      type: "title"
    },
    automatic: {
      name: "Automatically upload logs on FTP",
      type: "checkbox"
    }
  }
};

class Infobar extends Component {
  constructor(props) {
    super(props);
    this.state = { configModalIsOpen: false };
  }

  openConfigModal = () => {
    this.setState({ configModalIsOpen: true });
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
          contentLabel="General Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form onChange={this.props.api.changeConfig}>
              <h2>General configuration</h2>
              <div className="infobar--modalButtons">
                <input
                  type="button"
                  value="Load default"
                  onClick={() => {
                    this.props.api.loadConfig("template.json");
                  }}
                />
                <input type="button" value="Save config" onClick={() => {}} />
                <input type="button" value="Load config" onClick={() => {}} />
              </div>
              {makeForm(configurationValues, this.props.config)}
            </form>
          )}
        </Modal>

        <div
          className="infobar"
          onClick={this.props.configLocked ? null : this.openConfigModal}
        >
          <FitText>
            <div className="infobar--item">
              <div className="center">{this.props.name}</div>
            </div>
          </FitText>
          <FitText>
            <div className="infobar--item">
              <div className="center">{this.props.ip}</div>
            </div>
          </FitText>
          <FitText>
            <div className="infobar--item">
              <div className="center">
                {moment(this.props.time).format("HH:mm:ss")}
              </div>
            </div>
          </FitText>
          <FitText>
            <div className="infobar--item">
              <div className="center">
                {moment(this.props.time).format("DD-MM-YYYY")}
              </div>
            </div>
          </FitText>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const name = state.static.name;
  const ip = state.misc.ip;
  const time = state.misc.time;

  const configLocked = state.config.locked;
  const config = state.config;

  return {
    name,
    ip,
    time,
    configLocked,
    config
  };
}

export default connect(mapStateToProps)(Infobar);
