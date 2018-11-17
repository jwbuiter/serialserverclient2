import React, { Component } from "react";
import { connect } from "react-redux";

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
            {this.props.name} | {this.props.ip}{" "}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.static.name,
    ip: state.misc.ip,
    time: state.misc.time
  };
}

export default connect(mapStateToProps)(Infobar);
