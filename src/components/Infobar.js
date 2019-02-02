import React, { Component } from "react";
import FitText from "react-fittext";
import moment from "moment";
import { connect } from "react-redux";
import Modal from "react-modal";

import { makeForm } from "../helpers";

import "../styles/infobar.scss";

Modal.setAppElement("#root");

const configurationValues = {
  serial: {
    title: {
      name: "Serial",
      type: "title"
    },
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
      name: "Reset mode",
      type: "select",
      options: { off: "Off", time: "Time of day", interval: "Time interval" }
    },
    resetValue: {
      name: "Reset time",
      type: "time",
      condition: config => config.logger.resetMode === "time"
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
    this.uploadRef = React.createRef();
    this.state = { configModalIsOpen: false, listModalIsOpen: false };
  }

  openConfigModal = () => {
    this.setState({ configModalIsOpen: true });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  openListModal = () => {
    this.setState({ listModalIsOpen: true });
  };

  closeListModal = () => {
    this.setState({ listModalIsOpen: false });
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.state.listModalIsOpen}
          onRequestClose={this.closeListModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="List of loadable configurations"
        >
          <h2>List of saved configurations</h2>
          <form>
            {this.props.configList.map(config => {
              return (
                <>
                  {config}
                  <input
                    type="button"
                    value="Delete"
                    onClick={() => this.props.api.deleteConfig(config)}
                  />
                  <input
                    type="button"
                    value="Load"
                    onClick={() => this.props.api.loadConfig(config)}
                  />
                  <input
                    type="button"
                    value="Download"
                    onClick={() => this.props.api.downloadConfig(config)}
                  />
                  <br />
                </>
              );
            })}
            <input
              type="button"
              value="Upload"
              onClick={() => this.uploadRef.click()}
            />
            <input
              type="button"
              value="Load default"
              onClick={() => {
                this.props.api.loadConfig("template.json");
              }}
            />
          </form>
          <form
            id="uploadForm"
            action="uploadConfig"
            method="post"
            enctype="multipart/form-data"
            onChange={event => {
              const file = event.target.files[0];

              const versionName = file.name.match(/V[0-9\.]+\.json$/);
              if (!versionName) {
                alert("Config does not have a valid name");
                return;
              }
              const mayorVersion = versionName[0].slice(1, -3).split(".")[0];

              const currentMayorVersion = this.props.config.version.split(
                "."
              )[0];

              if (mayorVersion !== currentMayorVersion) {
                alert("Version of new config does not match the current one");
                return;
              }

              this.uploadRef.parentElement.submit();
            }}
          >
            <input
              style={{ display: "none" }}
              type="file"
              name="importConfig"
              accept=".json"
              ref={input => {
                this.uploadRef = input;
              }}
            />
          </form>
        </Modal>
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
                  value="Save config"
                  onClick={() => {
                    const name = prompt(
                      "Please enter the name for the new config file:",
                      "config"
                    );
                    if (name) this.props.api.saveConfig(name);
                  }}
                />
                <input
                  type="button"
                  value="Load config"
                  onClick={() => {
                    this.props.api.getConfigList();
                    this.openListModal();
                    this.closeConfigModal();
                  }}
                />
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

  const configList = state.misc.configList;

  return {
    name,
    ip,
    time,
    configLocked,
    config,
    configList
  };
}

export default connect(mapStateToProps)(Infobar);
