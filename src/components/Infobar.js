import React, { Component } from "react";
import FitText from "react-fittext";
import moment from "moment";
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
          <FitText compressor={4}>
            <div className="center">
              {this.props.name} | {this.props.ip} |
              {moment(this.props.time).format(" HH:mm:ss | MMMM Do YYYY")}
            </div>
          </FitText>
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
