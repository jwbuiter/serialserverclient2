import React, { Component } from "react";
import { connect } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import Toggle from "react-toggle";
import Modal from "react-modal";
import moment from "moment";

import { downloadExcel, uploadExcel } from "../actions/excelActions";
import { downloadAllLogs, downloadLog, deleteLog, deleteAllLogs, getLogList, uploadLog } from "../actions/logActions";
import { saveConfig, changeConfig, confirmPassword } from "../actions/configActions";
import { unlockConfig, toggleMenu, openMenu, closeMenu, reboot, shutdown } from "../actions/menuActions";
import { setDateTime } from "../actions/internalActions";
import { resetSLData } from "../actions/selfLearningActions";

import { makeForm } from "../helpers";
import { isUndefined } from "util";
import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadModalIsOpen: false,
      logModalIsOpen: false,
      dateTimeModalIsOpen: false,
      newCycleModalIsOpen: false,
      newDate: moment(this.props.time).format("YYYY-MM-DDTHH:mm"),
      qsClickedTimes: 0
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

  openUploadModal = () => {
    this.setState({ uploadModalIsOpen: true });
    this.props.closeMenu();
  };

  closeUploadModal = () => {
    this.setState({ uploadModalIsOpen: false });
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

  uploadLog = (log, index) => {
    if (window.confirm("Do you really want to upload " + log + "?")) {
      this.props.uploadLog(log, index);
    }
  };

  deleteLog = log => {
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
      this.props.confirmPassword(window.prompt("Enter password", ""), correct => {
        if (correct) this.props.unlockConfig();
        else window.alert("Password incorrect");
      });
    } else {
      this.props.saveConfig();
    }
  };

  render() {
    const closeMenu = this.props.closeMenu;

    let rounding = 0;
    if (!isUndefined(this.props.comIndex)) rounding = this.props.config.serial.coms[this.props.comIndex].digits;

    const newCycleValues = {
      selfLearning: {
        downloadExcel: {
          name: "Download Excel file",
          type: "button",
          onClick: () => {
            this.props.downloadExcel();
          }
        },
        resetSL: {
          name: "Reset Self Learning Data",
          type: "button",
          onClick: () => {
            this.props.resetSLData();
          }
        },
        logID: {
          type: "external",
          location: "logger.logID",
          configuration: {
            name: "LogID",
            type: "text"
          }
        },
        startCalibration: {
          name: "Calibration",
          type: "number",
          min: 0,
          step: 1,
          rounding
        },
        totalNumber: {
          name: "Total number",
          type: "number",
          min: 0,
          step: 1
        }
      }
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
            {this.props.logList.map(log => (
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
            onSubmit={event => {
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
              onChange={event => this.setState({ newDate: event.target.value })}
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
          <form>
            <h2>Start new cycle</h2>
            {this.state.newCycleModalIsOpen && makeForm(newCycleValues, this.props.config, this.props.changeConfig)}
          </form>
        </Modal>
        <Menu
          right
          customBurgerIcon={false}
          pageWrapId="page-wrap"
          outerContainerId="outer-container"
          isOpen={this.props.isMenuOpen}
          onStateChange={newState => !newState.isOpen && closeMenu()}
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
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                this.openNewCycleModal();
              }}
            >
              Start new cycle
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
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                uploadExcel();
                //this.openUploadModal();
                //closeMenu();
              }}
            >
              Import Excel
            </span>
          )}
          <span
            className="menu-item menu-item--clickable"
            onClick={() => {
              if (window.confirm("Are you sure you want to reboot?")) {
                this.props.reboot();
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
          <span
            className="menu-item menu-item--clickable"
            onClick={() => {
              this.openDateTimeModal();
            }}
          >
            Set date and time
          </span>
          <span
            className="menu-item"
            onClick={() => {
              this.handleQSClicked();
            }}
          >
            QS code: {this.props.QS}
          </span>
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
      selfLearningEnabled: ""
    };
  }
  return {
    configLocked: state.config.locked,
    config: state.config,
    isMenuOpen: state.misc.isMenuOpen,
    QS: state.static.QS,
    writeLogs: state.config.logger.writeToFile,
    exposeUpload: state.static.exposeUpload,
    exposeShutdown: state.static.exposeShutdown,
    exposeSettings: state.static.exposeSettings,
    logList: state.misc.logList,
    ftpTargets: state.config.FTP.targets,
    selfLearningEnabled: state.config.selfLearning.enabled,
    time: state.misc.time
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
  shutdown,
  uploadLog,
  setDateTime,
  changeConfig,
  resetSLData,
  confirmPassword
})(Sidebar);
