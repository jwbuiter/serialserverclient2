import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import "../styles/sidebar.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu>
        <a className="menu-item">View logs</a>
      </Menu>
    );
  }
}

export default Sidebar;
