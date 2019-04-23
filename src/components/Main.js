import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import Toggle from "react-toggle";
import classNames from "classnames";

import { loadConfig, loadStatic } from "../actions/configActions";
import { getLog } from "../actions/logActions";
import { openMenu, getLogo } from "../actions/menuActions";

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

    this.props.loadConfig();
    this.props.loadStatic();

    getLogo().then(result => {
      if (result) {
        this.setState({ logo: result });
      }
    });

    this.state = {
      logModalIsOpen: false,
      logModalFilterType: "none",
      logEntries: [],
      logTableColumns: [],
      logo: MBDC,
      reloadInterval: null
    };
  }

  filterTypes = [
    {
      id: "none",
      name: "Show all",
      filter: entry => true
    }
  ];

  openLogModal = () => {
    if (this.props.uniqueLogEnabled) {
      this.filterTypes.push({
        id: "unique",
        name: "Show only unique",
        filter: entry => entry.TU
      });
    }

    if (this.props.activityCounter) {
      this.filterTypes.push({
        id: "activity",
        name: "Show only activity",
        filter: entry => entry.TA
      });
    }
    this.setState({
      logModalIsOpen: true,
      reloadInterval: setInterval(this.reloadLogEntries, 1000)
    });
    this.reloadLogEntries();
  };

  reloadLogEntries = e => {
    const filterType = e ? e.target.value : this.state.logModalFilterType;

    const filter = this.filterTypes.find(filter => filter.id === filterType).filter;

    getLog().then(result => {
      this.setState({
        logTableColumns: result.data.legend
          .map((name, index) => ({
            Header: () => <b>{name}</b>,
            accessor: result.data.accessors[index],
            width: getColumnWidth(result.data.entries, result.data.accessors[index]),
            style: { textAlign: "center" },
            Cell: props => {
              if (typeof props.value === "number") {
                return props.value.toFixed(result.data.digits[index]);
              }
              return props.value;
            },
            name
          }))
          .filter((column, index) => index >= 2)
          .filter(column => this.props.uniqueLogEnabled || column.name !== "TU")
          .filter(column => this.props.activityCounter || column.name !== "TA"),
        logEntries: result.data.entries.filter(filter),
        logModalFilterType: filterType
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
            {this.filterTypes.length > 1 && (
              <span>
                <select value={this.state.logModalUnique} onChange={this.reloadLogEntries}>
                  {this.filterTypes.map(filter => (
                    <option value={filter.id}>{filter.name}</option>
                  ))}
                </select>
              </span>
            )}

            <div className="main--logModal">
              <div>
                <div className="main--logModal--title">
                  <b>{this.state.logModalUnique ? "Unique Log" : "Normal Log"}</b>
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
            <Infobar />
          </div>

          <div className="logo">
            <Logo image={this.state.logo} alt="LOGO" onClick={this.props.openMenu} />
          </div>

          <div
            className={classNames("coms", {
              "coms--noselfLearning": !this.props.showSelfLearning
            })}
          >
            {this.props.showSelfLearning && <SelfLearning />}
            <ComList />
          </div>

          {this.props.showOutputs && <div className="outputs">{this.props.showOutputs && <OutputList />} </div>}
          {this.props.showInputs && <div className="inputs">{this.props.showInputs && <InputList />}</div>}
          {this.props.showTable && (
            <div className="table">
              <Table openLog={this.openLogModal} />
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
    state.static.enabledModules.selfLearning && (!configLocked || state.internal.selfLearning.enabled);

  const uniqueLogEnabled = state.config.logger.unique !== "off";

  const { activityCounter } = state.config.selfLearning;

  return {
    loaded: true,
    showTable,
    showInputs,
    showOutputs,
    showSelfLearning,
    configLocked,
    uniqueLogEnabled,
    activityCounter
  };
}

export default connect(
  mapStateToProps,
  { loadConfig, loadStatic, openMenu }
)(Main);
