import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import Toggle from "react-toggle";

const individualColors = ["", "green", "yellow", "orange", "red"];
const textColors = ["black", "white", "black", "black", "white"];

class SelfLearningModal extends Component {
  constructor(props) {
    super(props);
    this.state = { showIndividualTable: true };
  }

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
        accessor: row => row.entries[0],
        Cell: props => props.value.toFixed(rounding),
        id: 10,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-1",
        accessor: row => row.entries[1] || "",
        Cell: props => props.value.toFixed(rounding),
        id: 2,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-2",
        accessor: row => row.entries[2] || "",
        Cell: props => props.value.toFixed(rounding),
        id: 3,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-3",
        accessor: row => row.entries[3] || "",
        Cell: props => props.value.toFixed(rounding),
        id: 4,
        style: { textAlign: "center" },
        width: 70
      },
      {
        Header: "-4",
        accessor: row => row.entries[4] || "",
        Cell: props => props.value.toFixed(rounding),
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
        Header: this.props.tableExtraColumnTitle,
        accessor: "extra",
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
            <b>Delete</b>
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
    ].map(column => ({ ...column, Header: <b>{column.Header}</b> }));

    const individualTableColumns = [
      {
        Header: valueName,
        accessor: "calibration",
        style: { textAlign: "center" },
        width: 70,
        Cell: props => props.value.toFixed(rounding),
        id: 12
      },
      {
        Header: keyName,
        accessor: "key",
        style: { textAlign: "center" },
        width: 200
      },
      {
        Header: this.props.tableExtraColumnTitle,
        accessor: "extra",
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
                backgroundColor:
                  individualColors[Math.min(4, props.original.increments)],
                color: textColors[Math.min(4, props.original.increments)]
              }}
            >
              {props.value.toFixed(1)}
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
        Header: "-1",
        accessor: row => row.numUpdatesHistory[0] || "",
        style: { textAlign: "center" },
        width: 50,
        id: 1
      },
      {
        Header: "-2",
        accessor: row => row.numUpdatesHistory[1] || "",
        style: { textAlign: "center" },
        width: 50,
        id: 2
      },
      {
        Header: "-3",
        accessor: row => row.numUpdatesHistory[2] || "",
        style: { textAlign: "center" },
        width: 50,
        id: 3
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
            <b>Delete</b>
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
              {" "}
              Delete
            </button>
          );
        },
        id: 4,
        style: { textAlign: "center" },
        width: 70
      }
    ].map(column => ({
      ...column,
      Header: (
        <>
          <b>{column.Header}</b>
        </>
      )
    }));

    const individualEntries = [];
    const generalEntries = [];

    for (let key in this.props.generalEntries) {
      generalEntries.push({ key, ...this.props.generalEntries[key] });
    }
    for (let key in this.props.individualEntries) {
      individualEntries.push({ key, ...this.props.individualEntries[key] });
    }

    return (
      <>
        <span>
          <Toggle
            checked={this.state.showIndividualTable}
            onChange={this.toggleIndividualTable}
          />
          {this.state.showIndividualTable ? " Show SL-list" : " Show UN-list"}
        </span>
        <span className="selfLearning--modal--buttons">
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
            <b>Reset</b>
          </button>
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
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        overlayClassName="modalOverlay"
        className="modalContent"
        contentLabel="SelfLearning Modal"
      >
        {this.props.isOpen && this.getSLModalContent()}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const configLocked = state.config.locked;
  const config = state.config;
  const individual = state.internal.selfLearning.individual;
  const tableExtraColumnTitle = state.config.selfLearning.tableExtraColumnTitle;

  return {
    ...state.internal.selfLearning,
    configLocked,
    config,
    individual,
    tableExtraColumnTitle
  };
}

export default connect(mapStateToProps)(SelfLearningModal);
