import React, { Component } from "react";
import ComElement from "./ComElement";
import OutputList from "./OutputList";
import InputList from "./InputList";
import Logo from "./Logo";

import allflex from "../assets/Logo-Allflex.png";
import MBDC from "../assets/Logo-MBDC.jpg";
import Infobar from "./Infobar";

import "../styles/main.scss";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="page-wrap" className="main">
        <div className="head">
          <div />
          <Infobar />
          <Logo image={allflex} />
          <Logo image={MBDC} />
        </div>
        <div className="coms">
          <ComElement
            title="Gewogen gewicht"
            content={{ value: 20, unit: "kg", comment: "" }}
          />
          <ComElement
            title="EID nummer"
            content={{ value: "0987654321", unit: "", comment: "E-nummer" }}
          />
        </div>
        <div className="ports">
          <OutputList />
          <InputList />
        </div>
      </div>
    );
  }
}

export default Main;
