import React, { Component } from "react";
import { push as Menu } from "react-burger-menu";
import Toggle from "react-toggle";

import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <span className="menu-item">
          Unlock settings <Toggle />
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

export default Sidebar;
