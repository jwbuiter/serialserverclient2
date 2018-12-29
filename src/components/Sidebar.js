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
        customBurgerIcon={false}
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        isOpen={this.props.isMenuOpen}
      >
        <span className="menu-item">
          Unlock settings <Toggle onChange={this.toggleConfigLock} />
        </span>
        <a
          className="menu-item"
          href=""
          onClick={() => {
            if (window.confirm("Are you sure you want to reboot?"))
              this.props.api.reboot();
          }}
        >
          Reboot unit
        </a>
        <span className="menu-item">Upload data</span>
        <a
          className="menu-item"
          href=""
          onClick={() => {
            if (window.confirm("Are you sure you want to shutdown?"))
              this.props.api.shutdown();
          }}
        >
          Shutdown unit
        </a>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    isMenuOpen: state.misc.isMenuOpen
  };
}

export default connect(mapStateToProps)(Sidebar);
