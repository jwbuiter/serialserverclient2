import React, { Component } from "react";
import "../styles/infobar.scss";

class Infobar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="infobar">
        <div className="infobar--item">
          <div className="center">
            naam | ip adress | tijd | datum | id teamviewer
          </div>
        </div>
      </div>
    );
  }
}

export default Infobar;
