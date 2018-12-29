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
        <FitText>
          <div className="infobar--item">
            <div className="center">{this.props.name}</div>
          </div>
        </FitText>
        <FitText>
          <div className="infobar--item">
            <div className="center">{this.props.ip}</div>
          </div>
        </FitText>
        <FitText>
          <div className="infobar--item">
            <div className="center">
              {moment(this.props.time).format("HH:mm:ss")}
            </div>
          </div>
        </FitText>
        <FitText>
          <div className="infobar--item">
            <div className="center">
              {moment(this.props.time).format("DD-MM-YYYY")}
            </div>
          </div>
        </FitText>
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
