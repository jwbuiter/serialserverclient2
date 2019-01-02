import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import Toggle from "react-toggle";
import classNames from "classnames";

import ComElement from "./ComElement";
import OutputList from "./OutputList";
import InputList from "./InputList";
import Table from "./Table";
import SelfLearning from "./SelfLearning";
import Logo from "./Logo";

import MBDC from "../assets/Logo-MBDC.jpg";
import Infobar from "./Infobar";

import "../styles/main.scss";
import "react-toggle/style.css";

Modal.setAppElement("#root");

const getColumnWidth = (rows, accessor) => {
  const maxWidth = 400;
  const minWidth = 50;
  const magicSpacing = 11;
  const cellLength = Math.max(
    ...rows.map(row => (`${row[accessor]}` || "").length)
  );
  return Math.max(minWidth, Math.min(maxWidth, cellLength * magicSpacing));
};

class Main extends Component {
  constructor(props) {
    super(props);

    props.api.getLogo().then(result => {
      if (result) {
        this.setState({ logo: result });
      }
    });

    this.state = {
      logModalIsOpen: false,
      logModalUnique: false,
      logEntries: [],
      logTableColumns: [],
      logo: MBDC
    };
  }

  openLogModal = () => {
    this.setState({ logModalIsOpen: true });
    this.reloadLogEntries({ target: { checked: this.state.logModalUnique } });
  };

  reloadLogEntries = e => {
    const unique = e.target.checked;
    const getFunction = unique
      ? this.props.api.getUniqueLog
      : this.props.api.getLog;

    getFunction().then(result => {
      this.setState({
        logTableColumns: result.data.legend.map((name, index) => ({
          Header: () => <b>{name}</b>,
          accessor: index + "",
          width: getColumnWidth(result.data.entries, index + ""),
          style: { textAlign: "center" }
        })),
        logEntries: result.data.entries,
        logModalUnique: unique
      });
    });
  };

  closeLogModal = () => {
    this.setState({ logModalIsOpen: false });
  };

  render() {
    if (!this.props.loaded) {
      return <div>Loading</div>;
    }

    const showTable = this.props.cells.reduce((acc, cur) => {
      return acc || cur.name;
    }, false);
    const showInputs = this.props.outputs.reduce((acc, cur) => {
      return acc || cur.name;
    }, false);
    const showOutputs = this.props.outputs.reduce((acc, cur) => {
      return acc || cur.name;
    }, false);
    const showPorts = showInputs || showOutputs;

    return (
      <div id="page-wrap">
        .
        <div
          className={classNames(
            "main",
            { "main--noports": !showPorts },
            { "main--notable": !showTable }
          )}
        >
          <Modal
            isOpen={this.state.logModalIsOpen}
            onRequestClose={this.closeLogModal}
            overlayClassName="modalOverlay"
            className="modalContent"
            contentLabel="Log Modal"
          >
            {this.props.uniqueLogEnabled && (
              <span>
                <Toggle
                  checked={this.state.logModalUnique}
                  onChange={this.reloadLogEntries}
                />
                Only show unique entries
              </span>
            )}
            <div className="main--logModal">
              <div>
                <div className="main--logModal--title">
                  {this.state.logModalUnique ? "Unique Log" : "Normal Log"}
                </div>
                <ReactTable
                  style={{ fontSize: 13 }}
                  data={this.state.logEntries}
                  columns={this.state.logTableColumns}
                />
              </div>
            </div>
          </Modal>
          <Infobar />
          <div className="logos">
            <Logo
              image={this.state.logo}
              alt="LOGO"
              onClick={this.props.api.toggleMenu}
            />
            {this.props.selfLearningEnabled && <SelfLearning />}
          </div>
          <div className="coms">
            {this.props.coms.map((com, index) => {
              return (
                <ComElement
                  key={index}
                  name={com.name}
                  entry={com.entry}
                  time={com.time}
                  average={com.average}
                  entries={com.entries}
                />
              );
            })}
          </div>
          {showPorts && (
            <div className="ports">
              {showOutputs && (
                <OutputList
                  outputs={this.props.outputs}
                  clickFunction={this.props.api.forceOutput}
                />
              )}
              {showInputs && (
                <InputList
                  inputs={this.props.inputs}
                  clickFunction={this.props.api.forceInput}
                />
              )}
            </div>
          )}
          {showTable && (
            <div className="table">
              <Table
                api={this.props.api}
                cells={this.props.cells}
                openLog={this.openLogModal}
              />
            </div>
          )}
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
    ...state.config.serial.coms[index]
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

  const selfLearningEnabled = state.internal.selfLearning.enabled;

  const configLocked = state.config.locked;

  const uniqueLogEnabled = state.config.logger.unique !== "off";

  return {
    loaded: true,
    coms,
    inputs,
    outputs,
    cells,
    selfLearningEnabled,
    configLocked,
    uniqueLogEnabled
  };
}

export default connect(mapStateToProps)(Main);
