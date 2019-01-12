import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import FitText from "react-fittext";
import classNames from "classnames";

import { makeForm } from "../configHelper";
import "../styles/selfLearning.scss";
import "react-table/react-table.css";

const configurationValues = {
  selfLearning: {
    enabled: {
      name: "Enabled type",
      type: "select",
      options: {
        off: "Off",
        com0: "Com 0",
        com1: "Com 1",
        com0ind: "Com 0 Individual",
        com1ind: "Com 1 Individual"
      }
    },
    number: {
      name: "Number",
      type: "number",
      min: 0,
      step: 1
    },
    startCalibration: {
      name: "Calibration",
      type: "number",
      min: 0,
      step: 1
    },
    tolerance: {
      name: "Tolerance",
      type: "number",
      min: 0,
      step: 1
    },
    startTolerance: {
      name: "Additional tolerance during learning",
      type: "number",
      min: 0,
      step: 1
    },
    individualTolerance: {
      name: "Individual tolerance",
      type: "number",
      min: 0,
      step: 1
    },
    individualToleranceIncrement: {
      name: "Individual tolerance increment",
      type: "number",
      min: 0,
      step: 1
    },
    individualToleranceLimit: {
      name: "Individual tolerance limit",
      type: "number",
      min: 0,
      step: 1
    }
  }
};

const generalTableColumns = [
  {
    Header: "Com0",
    accessor: row => row.entries[0],
    id: 1,
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "-1",
    accessor: row => row.entries[1],
    id: 2,
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "-2",
    accessor: row => row.entries[2],
    id: 3,
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "-3",
    accessor: row => row.entries[3],
    id: 4,
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "-4",
    accessor: row => row.entries[4],
    id: 5,
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "Com1",
    accessor: "key",
    style: { textAlign: "center" },
    width: 200
  },
  {
    Header: () => <input type="text" />,
    accessor: "calibration",
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: props => <button>Delete</button>,
    Cell: props => <button>Delete</button>,
    id: 1,
    style: { textAlign: "center" },
    width: 70
  }
];

const individualColors = ["", "green", "yellow", "orange", "red"];
const textColors = ["black", "white", "black", "black", "white"];

const individualTableColumns = [
  {
    Header: "Com0",
    accessor: "calibration",
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "Com1",
    accessor: "key",
    style: { textAlign: "center" },
    width: 200
  },
  {
    Header: () => <input type="text" />,
    accessor: "calibration",
    style: { textAlign: "center" },
    width: 70
  },
  {
    Header: "Tol",
    accessor: "tolerance",
    Cell: props => {
      console.log(props);
      return (
        <div
          style={{
            backgroundColor: individualColors[props.original.increments],
            color: textColors[props.original.increments]
          }}
        >
          {props.value}
        </div>
      );
    },
    style: { textAlign: "center" },
    width: 50
  },
  {
    Header: "Num",
    accessor: "numUpdates",
    style: { textAlign: "center" },
    width: 50
  },
  {
    Header: props => <button>Delete</button>,
    Cell: props => <button>Delete</button>,
    id: 1,
    style: { textAlign: "center" },
    width: 70
  }
];

Modal.setAppElement("#root");

class SelfLearning extends Component {
  constructor(props) {
    super(props);
    this.state = { SLModalIsOpen: false, configModalIsOpen: false };
  }

  openSLModal = () => {
    this.setState({ SLModalIsOpen: true });
  };

  closeSLModal = () => {
    this.setState({ SLModalIsOpen: false });
  };

  openConfigModal = () => {
    this.setState({ configModalIsOpen: true });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  render() {
    const indicators = [
      "selfLearning--inProgress",
      "selfLearning--success",
      "selfLearning--warning"
    ];

    const individualEntries = [];
    const generalEntries = [];

    for (let key in this.props.generalEntries) {
      generalEntries.push({ key, entries: this.props.generalEntries[key] });
    }
    for (let key in this.props.individualEntries) {
      console.log(this.props.individualEntries[key]);
      individualEntries.push({ key, ...this.props.individualEntries[key] });
    }

    const cells = [
      "Self Learning:",
      this.props.calibration || 0,
      ...(this.props.individual
        ? [this.props.tolerance * 100 + "%"]
        : [
            (this.props.tolerance || 0) * 100 + "%",
            (this.props.tolerance || 0 - this.props.matchedTolerance || 0) *
              100 +
              "%"
          ])
    ];

    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SelfLearning Configuration Modal"
        >
          <form onChange={this.props.api.changeConfig}>
            <h2>Configuration for SelfLearning</h2>
            {makeForm(configurationValues, this.props.config)}
          </form>
        </Modal>
        <Modal
          isOpen={this.state.SLModalIsOpen}
          onRequestClose={this.closeSLModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SelfLearning Modal"
        >
          <div>SL: Ind COM0</div>
          <div className="selfLearning--modal">
            <div>
              <div className="selfLearning--modal--title"> SL-list </div>
              <ReactTable
                style={{ textAlign: "center" }}
                data={generalEntries}
                columns={generalTableColumns}
              />
            </div>
            <div>
              <div className="selfLearning--modal--title"> UN-list </div>
              <ReactTable
                data={individualEntries}
                columns={individualTableColumns}
              />
            </div>
          </div>
        </Modal>
        <div
          className={classNames(
            "selfLearning",
            indicators[this.props.success || 0]
          )}
          onClick={
            this.props.configLocked ? this.openSLModal : this.openConfigModal
          }
        >
          {cells.map(cell => (
            <div className={"selfLearning--cell"}>
              <div className="center">
                <FitText compressor={0.6}>
                  <div>{cell}</div>
                </FitText>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  const configLocked = state.config.locked;
  const config = state.config;

  return { ...state.internal.selfLearning, configLocked, config };
}

export default connect(mapStateToProps)(SelfLearning);
