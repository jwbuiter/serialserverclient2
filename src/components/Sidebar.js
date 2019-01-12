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

  toggleConfigLock = e => {
    if (e.target.checked) {
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
        >
          <span className="menu-item menu-item--clickable">
            Unlock settings <Toggle onChange={this.toggleConfigLock} />
          </span>
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
          <span
            className="menu-item menu-item--clickable"
            onClick={this.openUploadModal}
          >
            Upload data
          </span>
          <span
            className="menu-item menu-item--clickable"
            onClick={this.openLogModal}
          >
            Download log files
          </span>
          <span
            className="menu-item menu-item--clickable"
            href="/"
            onClick={() => {
              if (window.confirm("Are you sure you want to shutdown?"))
                this.props.api.shutdown();
            }}
          >
            Shutdown unit
          </span>
          <span className="menu-item" />
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
  return {
    isMenuOpen: state.misc.isMenuOpen,
    QS: state.static.QS
  };
}

export default connect(mapStateToProps)(Sidebar);
