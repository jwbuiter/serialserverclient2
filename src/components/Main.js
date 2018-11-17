import React, { Component } from "react";
import { connect } from "react-redux";

import ComElement from "./ComElement";
import OutputList from "./OutputList";
import InputList from "./InputList";
import TableCell from "./TableCell";
import Logo from "./Logo";

import allflex from "../assets/Logo-Allflex.png";
import MBDC from "../assets/Logo-MBDC.jpg";
import Infobar from "./Infobar";

import "../styles/main.scss";

class Main extends Component {
  render() {
    if (!this.props.loaded) {
      return <div>Loading</div>;
    }

    return (
      <div id="page-wrap" className="main">
        <Infobar />
        <div className="logos">
          <Logo image={allflex} />
          <Logo image={MBDC} />
        </div>
        <div className="coms">
          {this.props.coms.map(com => (
            <ComElement name={com.name} entry={com.entry} time={com.time} />
          ))}
        </div>
        <div className="ports">
          <OutputList outputs={this.props.outputs} />
          <InputList inputs={this.props.inputs} />
        </div>
        <div className="table">
          {this.props.cells.map(cell => (
            <TableCell
              name={cell.name}
              value={cell.value}
              manual={cell.manual}
            />
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (!state.config.loaded || !state.static.loaded) {
    return { loaded: false };
  }

  const coms = state.internal.coms.map((com, index) => ({
    ...com,
    name: state.config.serial.coms[index].name
  }));

  const inputs = state.internal.inputs.map((input, index) => ({
    ...input,
    name: state.config.input.ports[index].name
  }));

  const outputs = state.internal.outputs.map((output, index) => ({
    ...output,
    name: state.config.output.ports[index].name
  }));

  const cells = state.internal.cells.map((cell, index) => ({
    ...cell,
    name: state.config.table.cells[index].name
  }));

  return {
    loaded: true,
    coms,
    inputs,
    outputs,
    cells
  };
}

export default connect(mapStateToProps)(Main);
