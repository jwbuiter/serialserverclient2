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
import { getColumnWidth } from "../helpers";

import MBDC from "../assets/Logo-MBDC.jpg";
import Infobar from "./Infobar";

import "../styles/main.scss";
import "react-toggle/style.css";

Modal.setAppElement("#root");

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
      logo: MBDC,
      reloadInterval: null
    };
  }

  openLogModal = () => {
    this.setState({
      logModalIsOpen: true,
      reloadInterval: setInterval(this.reloadLogEntries, 1000)
    });
    this.reloadLogEntries();
  };

  reloadLogEntries = e => {
    const unique = e ? e.target.checked : this.state.logModalUnique;
    const getFunction = unique
      ? this.props.api.getUniqueLog
      : this.props.api.getLog;

    getFunction().then(result => {
      this.setState({
        logTableColumns: result.data.legend
          .map((name, index) => ({
            Header: () => <b>{name}</b>,
            accessor: index + "",
            width: getColumnWidth(result.data.entries, index + ""),
            style: { textAlign: "center" },
            name
          }))
          .filter((column, index) => index >= 2)
          .filter(
            column => this.props.uniqueLogEnabled || column.name !== "TU"
          ),
        logEntries: result.data.entries,
        logModalUnique: unique
      });
    });
  };

  closeLogModal = () => {
    clearInterval(this.state.reloadInterval);
    this.setState({ logModalIsOpen: false });
  };

  render() {
    if (!this.props.loaded) {
      return <div className="loadingScreen">Loading</div>;
    }

    return (
      <div id="page-wrap">
        <div
          className={classNames(
            "main",
            { "main--noinputs": !this.props.showInputs },
            { "main--notable": !this.props.showTable },
            { "main--nooutputs": !this.props.showOutputs }
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
                />{" "}
                Only show unique entries
              </span>
            )}
            <div className="main--logModal">
              <div>
                <div className="main--logModal--title">
                  {this.state.logModalUnique ? "Unique Log" : "Normal Log"}
                </div>
                <ReactTable
                  style={{ fontSize: 14 }}
                  data={this.state.logEntries}
                  columns={this.state.logTableColumns}
                />
              </div>
            </div>
          </Modal>
          <div className="info">
            <Infobar api={this.props.api} />
          </div>

          <div className="logo">
            <Logo
              image={this.state.logo}
              alt="LOGO"
              onClick={this.props.api.openMenu}
            />
          </div>

          <div
            className={classNames("coms", {
              "coms--noselfLearning": !this.props.showSelfLearning
            })}
          >
            {this.props.showSelfLearning && (
              <SelfLearning api={this.props.api} />
            )}
            <ComList api={this.props.api} />
          </div>

          {this.props.showOutputs && (
            <div className="outputs">
              {this.props.showOutputs && <OutputList api={this.props.api} />}{" "}
            </div>
          )}
          {this.props.showInputs && (
            <div className="inputs">
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
  const configLocked = state.config.locked;

  if (!state.config.loaded || !state.static.loaded) {
    return { loaded: false };
  }

  const showTable =
    state.static.exposeUpload &&
    (!configLocked ||
      state.config.table.cells.reduce((acc, cur) => {
        return acc || cur.name;
      }, false));

  const showInputs =
    state.static.exposeUpload &&
    (!configLocked ||
      state.config.input.ports.reduce((acc, cur) => {
        return acc || cur.name;
      }, false));

  const showOutputs =
    state.static.exposeUpload &&
    (!configLocked ||
      state.config.output.ports.reduce((acc, cur) => {
        return acc || cur.name;
      }, false));

  const showSelfLearning =
    state.static.enabledModules.selfLearning &&
    (!configLocked || state.internal.selfLearning.enabled);

  const uniqueLogEnabled = state.config.logger.unique !== "off";

  return {
    loaded: true,
    showTable,
    showInputs,
    showOutputs,
    showSelfLearning,
    configLocked,
    uniqueLogEnabled
  };
}

export default connect(mapStateToProps)(Main);
