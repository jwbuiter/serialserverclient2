import React, { Component } from "react";
import { connect } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import Toggle from "react-toggle";
import Modal from "react-modal";
import moment from "moment";

import { downloadExcel, uploadExcel } from "../actions/excelActions";
import { downloadAllLogs, downloadLog, deleteLog, deleteAllLogs, getLogList, uploadLog } from "../actions/logActions";
import { saveConfig, changeConfig, confirmPassword } from "../actions/configActions";
import { unlockConfig, toggleMenu, openMenu, closeMenu, reboot, hardReboot, shutdown } from "../actions/menuActions";
import { setDateTime } from "../actions/internalActions";
import { resetSLData } from "../actions/selfLearningActions";

import { makeForm } from "../helpers";
import "../styles/sidebar.scss";

const ftpTargetsValues = {
  logger: {
    resetTime: {
      name: "Reset time",
      type: "time",
      condition: (config) => config.logger.resetMode === "time",
    },
    resetInterval: {
      name: "Interval (min)",
      type: "number",
      min: 0,
      step: 1,
      condition: (config) => config.logger.resetMode === "interval",
    },
  },
  FTP: {
    targets: [1, 2].map((index) => ({
      title: {
        name: "Target " + index,
        type: "subtitle",
      },
      address: {
        name: "Address",
        type: "text",
      },
      folder: {
        name: "Folder",
        type: "text",
      },
      username: {
        name: "Username",
        type: "text",
      },
      password: {
        name: "Password",
        type: "text",
      },
    })),
  },
};

const transferTargetsValues = {
  table: {
    transferTargets: {
      name: "Transfer targets(address - name)",
      type: "keyValue",
      keyType: "text",
    },
  },
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logModalIsOpen: false,
      dateTimeModalIsOpen: false,
      newCycleModalIsOpen: false,
      newCycleTransferTarget: "",
      cycleSettingsModalIsOpen: false,
      passwordPromptIsOpen: false,
      password: "",
      importExcelModalIsOpen: false,
      ftpTargetsModalIsOpen: false,
      transferTargetsModelIsOpen: false,
      newDate: moment(this.props.time).format("YYYY-MM-DDTHH:mm"),
      qsClickedTimes: 0,
    };
  }

  toggleConfigLock = () => {
    if (!this.props.isMenuOpen) return;

    if (this.props.configLocked) {
      this.props.unlockConfig();
    } else {
      this.props.saveConfig();
    }
  };

  openLogModal = () => {
    this.setState({ logModalIsOpen: true });
    this.props.closeMenu();
  };

  closeLogModal = () => {
    this.setState({ logModalIsOpen: false });
  };

  openDateTimeModal = () => {
    this.setState({ dateTimeModalIsOpen: true });
    this.props.closeMenu();
  };

  closeDateTimeModal = () => {
    this.setState({ dateTimeModalIsOpen: false });
  };

  openNewCycleModal = () => {
    this.props.unlockConfig();
    this.setState({ newCycleModalIsOpen: true });
    this.props.closeMenu();
  };

  closeNewCycleModal = () => {
    this.props.saveConfig();
    this.setState({ newCycleModalIsOpen: false });
  };

  openCycleSettingsModal = () => {
    this.props.unlockConfig();
    this.setState({ cycleSettingsModalIsOpen: true });
    this.props.closeMenu();
  };

  closeCycleSettingsModal = () => {
    this.props.saveConfig();
    this.setState({ cycleSettingsModalIsOpen: false });
  };

  openPasswordPrompt = () => {
    this.setState({ passwordPromptIsOpen: true });
    this.props.closeMenu();
  };

  closePasswordPrompt = () => {
    this.setState({ passwordPromptIsOpen: false });
  };

  openImportExcelModal = () => {
    this.setState({ importExcelModalIsOpen: true });
    this.props.closeMenu();
  };

  closeImportExcelModal = () => {
    this.setState({ importExcelModalIsOpen: false });
  };

  openFtpTargetsModal = () => {
    this.props.unlockConfig();
    this.setState({ ftpTargetsModalIsOpen: true });
    this.props.closeMenu();
  };

  closeFtpTargetsModal = () => {
    this.props.saveConfig();
    this.setState({ ftpTargetsModalIsOpen: false });
  };

  openTransferTargetsModal = () => {
    this.props.unlockConfig();
    this.setState({ transferTargetsModalIsOpen: true });
    this.props.closeMenu();
  };

  closeTransferTargetsModal = () => {
    this.props.saveConfig();
    this.setState({ transferTargetsModalIsOpen: false });
  };

  uploadLog = (log, index) => {
    if (window.confirm("Do you really want to upload " + log + "?")) {
      this.props.uploadLog(log, index);
    }
  };

  deleteLog = (log) => {
    if (window.confirm("Do you really want to delete " + log + "?")) {
      this.props.deleteLog(log);
    }
  };

  downloadAllLogs = () => {
    if (window.confirm("Do you really want to download all logs?")) {
      this.props.downloadAllLogs();
    }
  };

  deleteAllLogs = () => {
    if (window.confirm("Do you really want to delete all logs?")) {
      this.props.deleteAllLogs();
    }
  };

  handleQSClicked = () => {
    if (this.state.qsClickedTimes < 5) {
      this.setState({ qsClickedTimes: this.state.qsClickedTimes + 1 });
      return;
    }

    if (this.props.configLocked) {
      this.openPasswordPrompt();
    } else {
      this.props.saveConfig();
    }
  };

  handlePasswordSubmitted = (e) => {
    e.preventDefault();
    this.props.confirmPassword(this.state.password, (correct) => {
      if (correct) {
        this.props.unlockConfig();
      } else {
        window.alert("Password incorrect");
      }
    });
    this.closePasswordPrompt();
  };

  render() {
    const closeMenu = this.props.closeMenu;

    let rounding = 0;
    if (this.props.comIndex != undefined) rounding = this.props.config.serial.coms[this.props.comIndex].digits;

    const newCycleValues = {
      selfLearning: {
        logID: {
          type: "external",
          location: "logger.logID",
          configuration: {
            name: "LogID",
            type: "text",
          },
        },
        startCalibration: {
          name: "Calibration",
          type: "number",
          min: 0,
          step: 1,
          rounding,
        },
        totalNumber: {
          name: "Total number",
          type: "number",
          min: 0,
          step: 1,
        },
      },
    };

    return (
      <>
        <Modal
          isOpen={this.state.logModalIsOpen}
          onRequestClose={this.closeLogModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Log files Modal"
        >
          <h2>Upload and download log files</h2>
          <form className="logForm">
            {this.props.logList.map((log) => (
              <>
                {log}
                <input
                  type="button"
                  value="Delete"
                  onClick={() => {
                    this.deleteLog(log);
                  }}
                />
                <input
                  type="button"
                  value="Download"
                  onClick={() => {
                    this.props.downloadLog(log);
                  }}
                />
                {this.props.ftpTargets.map((target, index) => {
                  if (target.address)
                    return (
                      <input
                        type="button"
                        value={`FTP ${index + 1}`}
                        onClick={() => {
                          this.uploadLog(log, index);
                        }}
                      />
                    );
                  return null;
                })}
                <br />
              </>
            ))}
            <input
              type="button"
              value="Delete"
              onClick={() => {
                this.deleteAllLogs();
              }}
            />
            <input
              type="button"
              value="Download"
              onClick={() => {
                this.downloadAllLogs();
              }}
            />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.dateTimeModalIsOpen}
          onRequestClose={this.closeDateTimeModal}
          overlayClassName="modalOverlay"
          className="modalContent dateTime"
          contentLabel="Date Time Modal"
        >
          <h3>Date and Time</h3>
          <br />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.props.setDateTime(this.state.newDate);
            }}
          >
            Change internal time:
            <input type="submit" value="Save" />
            <input
              type="datetime-local"
              name="newDate"
              value={this.state.newDate}
              onChange={(event) => this.setState({ newDate: event.target.value })}
            />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.newCycleModalIsOpen}
          onRequestClose={this.closeNewCycleModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="New SL Cycle Modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const hostElement = e.target.elements["host"];
              const host = hostElement.value;
              const name = hostElement.options[hostElement.selectedIndex].text;
              this.props.resetSLData(host, name);
            }}
          >
            <h2>Start new cycle</h2>
            {this.state.newCycleModalIsOpen && makeForm(newCycleValues, this.props.config, this.props.changeConfig)}
            <select
              name="host"
              value={this.state.newCycleTransferTarget}
              onChange={(change) => this.setState({ newCycleTransferTarget: change.target.value })}
            >
              <option value="">Do not transfer</option>
              {this.props.transferTargets.map((target) => (
                <option value={target.key}>{target.value}</option>
              ))}
            </select>
            <label htmlFor="host">Transfer target:</label>
            <br />
            <input type="submit" value={this.state.newCycleTransferTarget == "" ? "Reset" : "Transfer"} />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.cycleSettingsModalIsOpen}
          onRequestClose={this.closeCycleSettingsModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SL Cycle Settings Modal"
        >
          <form>
            <h2>Cycle settings</h2>
            {this.state.cycleSettingsModalIsOpen &&
              makeForm(newCycleValues, this.props.config, this.props.changeConfig)}
            <input type="submit" value="Save" />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.passwordPromptIsOpen}
          onRequestClose={this.closePasswordPrompt}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Config Password Prompt"
        >
          <form onSubmit={this.handlePasswordSubmitted}>
            <h2>Enter password</h2>
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <br />
            <input type="submit" />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.importExcelModalIsOpen}
          onRequestClose={this.closeImportExcelModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Import Excel Modal"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const file = e.target[0].files[0];
              const overwrite = e.target[1].checked;
              uploadExcel(file, overwrite);
              this.closeImportExcelModal();
            }}
          >
            <h2>Import Excel</h2>
            <label for="overwrite">File:</label>
            <input type="file" name="excelFile" accept=".xls,.xlsx" />
            <br />
            <input type="checkbox" name="overwrite" />
            <label for="overwrite">Overwrite:</label>
            <br />
            <input type="submit" value="Upload" />
          </form>
        </Modal>
        <Modal
          isOpen={this.state.ftpTargetsModalIsOpen}
          onRequestClose={this.closeFtpTargetsModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="FTP Targets Modal"
        >
          <form>
            <h2>FTP Targets</h2>
            {this.state.ftpTargetsModalIsOpen && makeForm(ftpTargetsValues, this.props.config, this.props.changeConfig)}
          </form>
        </Modal>
        <Modal
          isOpen={this.state.transferTargetsModalIsOpen}
          onRequestClose={this.closeTransferTargetsModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Transfer Targets Modal"
        >
          <form>
            <h2>Transfer Targets</h2>
            {this.state.transferTargetsModalIsOpen &&
              makeForm(transferTargetsValues, this.props.config, this.props.changeConfig)}
          </form>
        </Modal>
        <Menu
          right
          customBurgerIcon={false}
          pageWrapId="page-wrap"
          outerContainerId="outer-container"
          isOpen={this.props.isMenuOpen}
          onStateChange={(newState) => !newState.isOpen && closeMenu()}
          width={450}
        >
          {this.props.exposeSettings && (
            <span className="menu-item menu-item--clickable">
              <span
                onClick={() => {
                  closeMenu();
                  this.toggleConfigLock();
                }}
              >
                Unlock settings
              </span>{" "}
              <Toggle
                checked={!this.props.configLocked}
                onChange={() => {
                  closeMenu();
                  this.toggleConfigLock();
                }}
              />
            </span>
          )}
          {this.props.selfLearningEnabled.endsWith("ind") && (
            <span className="menu-item menu-item--clickable" onClick={this.openNewCycleModal}>
              Start new cycle
            </span>
          )}
          {this.props.selfLearningEnabled.endsWith("ind") && (
            <span className="menu-item menu-item--clickable" onClick={this.openCycleSettingsModal}>
              Change cycle settings
            </span>
          )}
          {this.props.writeLogs && this.props.exposeUpload && (
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                this.props.getLogList();
                this.openLogModal();
                closeMenu();
              }}
            >
              Log files
            </span>
          )}
          {this.props.exposeUpload && (
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                this.props.downloadExcel();
                closeMenu();
              }}
            >
              Download Excel
            </span>
          )}
          {this.props.exposeUpload && (
            <span className="menu-item menu-item--clickable" onClick={this.openImportExcelModal}>
              Import Excel
            </span>
          )}
          {this.props.exposeUpload && (
            <span className="menu-item menu-item--clickable" onClick={this.openTransferTargetsModal}>
              Excel Transfer Targets
            </span>
          )}
          {this.props.exposeUpload && (
            <span className="menu-item menu-item--clickable" onClick={this.openFtpTargetsModal}>
              FTP Targets
            </span>
          )}
          <span
            className="menu-item menu-item--clickable"
            onClick={() => {
              if (window.confirm("Are you sure you want to reboot?")) {
                if (this.props.manualResetHard) this.props.hardReboot();
                else this.props.reboot();
              }
              closeMenu();
            }}
          >
            Reboot unit
          </span>
          {this.props.exposeShutdown && (
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                if (window.confirm("Are you sure you want to shutdown?")) this.props.shutdown();
                closeMenu();
              }}
            >
              Shutdown unit
            </span>
          )}
          <span className="menu-item menu-item--clickable" onClick={this.openDateTimeModal}>
            Set date and time
          </span>
          <span className="menu-item" onClick={this.handleQSClicked}>
            QS code: {this.props.QS}
          </span>
          <span className="menu-item">{this.props.version}</span>
        </Menu>
      </>
    );
  }
}

function mapStateToProps(state) {
  if (!state.config.loaded || !state.static.loaded) {
    return {
      configLocked: false,
      isMenuOpen: false,
      QS: "null",
      writeLogs: false,
      exposeUpload: false,
      exposeShutdown: false,
      logList: [],
      selfLearningEnabled: "",
      transferTargets: [],
    };
  }
  return {
    configLocked: state.config.locked,
    config: state.config,
    isMenuOpen: state.misc.isMenuOpen,
    QS: state.static.QS,
    version: `V${state.static.version} - ${state.static.buildDate}`,
    writeLogs: state.config.logger.writeToFile,
    exposeUpload: state.static.exposeUpload,
    exposeShutdown: state.static.exposeShutdown,
    exposeSettings: state.static.exposeSettings,
    logList: state.misc.logList,
    ftpTargets: state.config.FTP.targets,
    selfLearningEnabled: state.config.selfLearning.enabled,
    time: state.misc.time,
    manualResetHard: state.static.manualResetHard,
    transferTargets: state.config.table.transferTargets,
  };
}

export default connect(mapStateToProps, {
  downloadExcel,
  downloadAllLogs,
  deleteLog,
  deleteAllLogs,
  downloadLog,
  getLogList,
  unlockConfig,
  toggleMenu,
  openMenu,
  closeMenu,
  saveConfig,
  reboot,
  hardReboot,
  shutdown,
  uploadLog,
  setDateTime,
  changeConfig,
  resetSLData,
  confirmPassword,
})(Sidebar);
