import React, { Component } from "react";
import { connect } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import Toggle from "react-toggle";
import Modal from "react-modal";

import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadModalIsOpen: false };
  }

  toggleConfigLock = () => {
    console.log("click");
    if (this.props.configLocked) {
      this.props.api.unlockConfig();
    } else {
      this.props.api.saveConfig();
    }
  };

  openUploadModal = () => {
    this.setState({ uploadModalIsOpen: true });
    this.props.api.toggleMenu();
  };

  closeUploadModal = () => {
    this.setState({ uploadModalIsOpen: false });
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.state.uploadModalIsOpen}
          onRequestClose={this.closeUploadModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="File Upload Modal"
        >
          <h2>Upload an excel file</h2>
          <form
            id="uploadForm"
            action="importFile"
            method="post"
            enctype="multipart/form-data"
          >
            <input type="button" value="Import .xls" onclick={() => {}} />
            <input type="file" name="importFile" accept=".xls" />
          </form>
        </Modal>
        <Menu
          right
          customBurgerIcon={false}
          pageWrapId="page-wrap"
          outerContainerId="outer-container"
          isOpen={this.props.isMenuOpen}
          onStateChange={newState =>
            !newState.isOpen && this.props.api.toggleMenu()
          }
          width={400}
        >
          <span className="menu-item menu-item--clickable">
            Unlock settings
            <Toggle
              onClick={event => {
                console.log(event.target);
                this.toggleConfigLock();
              }}
              readOnly
              checked={!this.props.configLocked}
            />
          </span>
          {this.props.writeLogs && (
            <span
              className="menu-item menu-item--clickable"
              onClick={this.openLogModal}
            >
              Log files
            </span>
          )}
          {this.props.exposeUpload && (
            <span
              className="menu-item menu-item--clickable"
              onClick={this.openUploadModal}
            >
              Import Excel
            </span>
          )}
          <span
            className="menu-item menu-item--clickable"
            onClick={() => {
              if (window.confirm("Are you sure you want to reboot?")) {
                this.props.api.reboot();
                this.props.api.toggleMenu();
              }
            }}
          >
            Reboot unit
          </span>
          {this.props.exposeShutdown && (
            <span
              className="menu-item menu-item--clickable"
              onClick={() => {
                if (window.confirm("Are you sure you want to shutdown?"))
                  this.props.api.shutdown();
              }}
            >
              Shutdown unit
            </span>
          )}
          <span className="menu-item">QS code: {this.props.QS}</span>
          <a className="menu-item" href="/settings">
            (OLD) serial settings
          </a>
          <a className="menu-item" href="/filesettings">
            (OLD) other settings
          </a>
          <a className="menu-item" href="/fileupload">
            (OLD) upload file
          </a>
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
      exposeShutdown: false
    };
  }
  return {
    configLocked: state.config.locked,
    isMenuOpen: state.misc.isMenuOpen,
    QS: state.static.QS,
    writeLogs: state.config.logger.writeToFile,
    exposeUpload: state.static.exposeUpload,
    exposeShutdown: state.static.exposeShutdown
  };
}

export default connect(mapStateToProps)(Sidebar);
