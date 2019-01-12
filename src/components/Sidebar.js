import React, { Component } from "react";
import { connect } from "react-redux";
import { slide as Menu } from "react-burger-menu";
import Toggle from "react-toggle";

import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleConfigLock = e => {
    if (e.target.checked) {
      this.props.api.unlockConfig();
    } else {
      this.props.api.saveConfig();
    }
  };

  render() {
    return (
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
            if (window.confirm("Are you sure you want to reboot?"))
              this.props.api.reboot();
          }}
        >
          Reboot unit
        </span>
        <span className="menu-item">Upload data</span>
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
        <a className="menu-item" href="/settings">
          (OLD) other settings
        </a>
        <a className="menu-item" href="/settings">
          (OLD) upload file
        </a>
      </Menu>
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
