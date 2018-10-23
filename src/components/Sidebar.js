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
        <a className="menu-item">View logs</a>
        <a className="menu-item">View logs</a>
      </Menu>
    );
  }
}

export default Sidebar;
