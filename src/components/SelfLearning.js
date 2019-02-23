import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import FitText from "react-fittext";
import classNames from "classnames";
import Toggle from "react-toggle";

import { makeForm } from "../helpers";
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
      step: 1,
      condition: config => config.selfLearning.enabled !== "off"
    },
    startCalibration: {
      name: "Calibration",
      type: "number",
      min: 0,
      step: 1,
      condition: config => config.selfLearning.enabled !== "off"
    },
    tolerance: {
      name: "Tolerance %",
      type: "number",
      min: 0,
      step: 1,
      condition: config => config.selfLearning.enabled !== "off"
    },
    startTolerance: {
      name: "Additional tolerance during learning %",
      type: "number",
      min: 0,
      step: 1,
      condition: config =>
        config.selfLearning.enabled !== "off" &&
        !config.selfLearning.enabled.endsWith("ind")
    },
    individualToleranceAbs: {
      name: "Individual tolerance",
      type: "number",
      min: 0,
      step: 1,
      condition: config => config.selfLearning.enabled.endsWith("ind")
    },
    individualTolerance: {
      name: "Individual tolerance %",
      type: "number",
      min: 0,
      step: 1,
      condition: config => config.selfLearning.enabled.endsWith("ind")
    },
    individualCorrectionIncrement: {
      name: "Correction %",
      type: "number",
      min: 0,
      step: 1,
      condition: config => config.selfLearning.enabled.endsWith("ind")
    },
    individualCorrectionLimit: {
      name: "Correction limit (max 9)",
      type: "number",
      min: 0,
      max: 9,
      step: 1,
      condition: config => config.selfLearning.enabled.endsWith("ind")
    }
  }
};

const individualColors = ["", "green", "yellow", "orange", "red"];
const textColors = ["black", "white", "black", "black", "white"];

Modal.setAppElement("#root");

class SelfLearning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SLModalIsOpen: false,
      configModalIsOpen: false,
      showIndividualTable: false
    };
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

  toggleIndividualTable = () => {
    this.setState({ showIndividualTable: !this.state.showIndividualTable });
  };

  getSLModalContent = () => {
    const keyName = this.props.config.serial.coms[1 - this.props.comIndex].name;
    const valueName = this.props.config.serial.coms[this.props.comIndex].name;
    const rounding = this.props.config.serial.coms[this.props.comIndex].digits;

    const generalTableColumns = [
      {
        Header: valueName,
        accessor: row => row.entries[0].toFixed(rounding),
        id: 10,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-1",
        accessor: row => {
          const val = row.entries[1];
          return val ? val.toFixed(rounding) : "";
        },
        id: 2,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-2",
        accessor: row => {
          const val = row.entries[2];
          return val ? val.toFixed(rounding) : "";
        },
        id: 3,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-3",
        accessor: row => {
          const val = row.entries[3];
          return val ? val.toFixed(rounding) : "";
        },
        id: 4,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-4",
        accessor: row => {
          const val = row.entries[4];
          return val ? val.toFixed(rounding) : "";
        },
        id: 5,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: keyName,
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
        Header: (
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete all general entries?`
                )
              ) {
                this.props.api.deleteGeneralSL();
              }
            }}
          >
            Delete
          </button>
        ),
        Cell: props => {
          return (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete general entries for ${
                      props.original.key
                    }?`
                  )
                ) {
                  this.props.api.deleteGeneralSL(props.original.key);
                }
              }}
            >
              Delete
            </button>
          );
        },
        id: 1,
        style: { textAlign: "center" },
        width: 70
      }
    ];

    const individualTableColumns = [
      {
        Header: valueName,
        accessor: row => row.calibration.toFixed(rounding),
        style: { textAlign: "center" },
        width: 70,
        id: 12
      },
      {
        Header: keyName,
        accessor: "key",
        style: { textAlign: "center" },
        width: 200
      },
      {
        Header: () => (
          <input type="text" onChange={e => console.log(e.target.value)} />
        ),
        accessor: "calibration",
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "Tol",
        accessor: "tolerance",
        Cell: props => {
          return (
            <div
              style={{
                backgroundColor: individualColors[props.original.increments],
                color: textColors[props.original.increments]
              }}
            >
              {props.value.toFixed(rounding)}
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
        Header: (
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete all individual entries?`
                )
              ) {
                this.props.api.deleteIndividualSL();
              }
            }}
          >
            Delete
          </button>
        ),
        Cell: props => {
          return (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete the entry for ${
                      props.original.key
                    }?`
                  )
                ) {
                  this.props.api.deleteIndividualSL(props.original.key);
                }
              }}
            >
              Delete
            </button>
          );
        },
        id: 1,
        style: { textAlign: "center" },
        width: 70
      }
    ];

    const individualEntries = [];
    const generalEntries = [];

    for (let key in this.props.generalEntries) {
      generalEntries.push({ key, entries: this.props.generalEntries[key] });
    }
    for (let key in this.props.individualEntries) {
      individualEntries.push({ key, ...this.props.individualEntries[key] });
    }

    return (
      <>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to reset the data of the individual selfLearning?"
              )
            )
              this.props.api.resetIndividualSL();
          }}
        >
          Reset
        </button>
        <span>
          <Toggle
            checked={this.state.showIndividualTable}
            onChange={this.toggleIndividualTable}
          />
          Show individual entries
        </span>
        {this.state.showIndividualTable ? (
          <>
            <div className="selfLearning--modal--title"> UN-list </div>
            <ReactTable
              data={individualEntries}
              columns={individualTableColumns}
            />
          </>
        ) : (
          <>
            <div className="selfLearning--modal--title"> SL-list </div>
            <ReactTable
              style={{ textAlign: "center" }}
              data={generalEntries}
              columns={generalTableColumns}
            />
          </>
        )}
      </>
    );
  };

  render() {
    const indicators = [
      "selfLearning--inProgress",
      "selfLearning--success",
      "selfLearning--warning"
    ];

    const cells = [
      "Self Learning",
      (this.props.calibration || 0).toFixed(
        this.props.config.serial.coms[this.props.comIndex || 0].digits
      ) || 0,
      Math.round((this.props.tolerance || 0) * 1000) / 10 + "%"
    ];

    if (!this.props.individual && this.props.success) {
      cells.push(
        Math.round(
          (this.props.tolerance || 0 - this.props.matchedTolerance || 0) * 1000
        ) /
          10 +
          "%"
      );
    }
    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SelfLearning Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form>
              <h2>Configuration for SelfLearning</h2>
              {makeForm(configurationValues, this.props.config, this.props.api)}
            </form>
          )}
        </Modal>
        <Modal
          isOpen={this.state.SLModalIsOpen}
          onRequestClose={this.closeSLModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SelfLearning Modal"
        >
          {this.state.SLModalIsOpen && this.getSLModalContent()}
        </Modal>

        <div
          className={classNames(
            "selfLearning",
            indicators[this.props.success || 0]
          )}
          onClick={
            this.props.configLocked
              ? this.props.individual
                ? this.openSLModal
                : null
              : this.openConfigModal
          }
        >
          {cells.map((cell, index) => (
            <div key={index} className={"selfLearning--cell"}>
              <div className="center">
                <FitText compressor={0.65}>
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
  const individual = state.internal.selfLearning.individual;

  return { ...state.internal.selfLearning, configLocked, config, individual };
}

export default connect(mapStateToProps)(SelfLearning);
