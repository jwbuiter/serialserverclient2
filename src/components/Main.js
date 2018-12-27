import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import Toggle from "react-toggle";

import ComElement from "./ComElement";
import OutputList from "./OutputList";
import InputList from "./InputList";
import TableCell from "./TableCell";
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
    this.state = {
      logModalIsOpen: false,
      logModalUnique: false,
      logEntries: [],
      logTableColumns: []
    };
  }

  openLogModal = () => {
    this.setState({ logModalIsOpen: true, logModalUnique: false });
    this.reloadLogEntries({ target: { checked: false } });
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

    return (
      <div id="page-wrap" className="main">
        <Modal
          isOpen={this.state.logModalIsOpen}
          onRequestClose={this.closeLogModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Log Modal"
        >
          <Toggle onChange={this.reloadLogEntries} />
          Only show unique entries
          <div className="main--logModal">
            <div>
              <div className="main--logModal--title">
                {this.state.logModalUnique ? "Unique Log" : "Normal Log"}{" "}
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
          <Logo image={MBDC} alt={"MBDC"} />
          {this.props.selfLearningEnabled && <SelfLearning />}
        </div>
        <div className="coms">
          {this.props.coms.map(com => {
            return (
              <ComElement
                name={com.name}
                entry={com.entry}
                time={com.time}
                average={com.average}
                entries={com.entries}
              />
            );
          })}
        </div>
        <div className="ports">
          <OutputList
            outputs={this.props.outputs}
            clickFunction={this.props.api.forceOutput}
          />
          <InputList
            inputs={this.props.inputs}
            clickFunction={this.props.api.forceInput}
          />
        </div>
        <div className="table">
          {this.props.cells.map(cell => (
            <TableCell
              name={cell.name}
              value={cell.value}
              manual={cell.manual}
              openLog={this.openLogModal}
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

  return {
    loaded: true,
    coms,
    inputs,
    outputs,
    cells,
    selfLearningEnabled
  };
}

export default connect(mapStateToProps)(Main);
