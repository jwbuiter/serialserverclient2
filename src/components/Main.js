import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import Toggle from "react-toggle";
import classNames from "classnames";

import ComList from "./ComList";
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
      return <div className="loadingScreen">Loading</div>;
    }

    return (
      <div id="page-wrap">
        .
        <div
          className={classNames(
            "main",
            { "main--noports": !this.props.showPorts },
            { "main--notable": !this.props.showTable }
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
          <Infobar api={this.props.api} />
          <div className="logos">
            <Logo
              image={this.state.logo}
              alt="LOGO"
              onClick={this.props.api.toggleMenu}
            />
            {this.props.selfLearningEnabled && (
              <SelfLearning api={this.props.api} />
            )}
          </div>
          <div className="coms">
            <ComList api={this.props.api} />
          </div>
          {this.props.showPorts && (
            <div className="ports">
              {this.props.showOutputs && <OutputList api={this.props.api} />}
              {this.props.showInputs && <InputList api={this.props.api} />}
            </div>
          )}
          {this.props.showTable && (
            <div className="table">
              <Table api={this.props.api} openLog={this.openLogModal} />
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

  const showTable = state.config.table.cells.reduce((acc, cur) => {
    return acc || cur.name;
  }, false);

  const showInputs = state.config.input.ports.reduce((acc, cur) => {
    return acc || cur.name;
  }, false);

  const showOutputs = state.config.output.ports.reduce((acc, cur) => {
    return acc || cur.name;
  }, false);

  const showPorts = showInputs || showOutputs;

  const selfLearningEnabled = state.internal.selfLearning.enabled;

  const configLocked = state.config.locked;

  const uniqueLogEnabled = state.config.logger.unique !== "off";

  return {
    loaded: true,
    showTable,
    showInputs,
    showOutputs,
    showPorts,
    selfLearningEnabled,
    configLocked,
    uniqueLogEnabled
  };
}

export default connect(mapStateToProps)(Main);
