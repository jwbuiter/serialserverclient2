import React, { Component } from "react";
import { push as Menu } from "react-burger-menu";
import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <span className="menu-item">Access settings</span>
        <span className="menu-item">Reboot unit</span>
        <span className="menu-item">Upload data</span>
        <span className="menu-item">Shutdown unit</span>
      </Menu>
    );
  }
}

export default Sidebar;
