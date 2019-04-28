import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "../util/ReactTableWrapper";
import Toggle from "react-toggle";
import dateFormat from "dateformat";

import { daysToDate } from "../../helpers";
import { deleteGeneralSL, deleteIndividualSL, resetIndividualSL } from "../../actions/selfLearningActions";

const individualColors = ["", "green", "yellow", "orange", "red"];
const textColors = ["black", "white", "black", "black", "white"];

function sum(list) {
  return list.filter(entry => entry).reduce((acc, cur) => acc + cur, 0);
}

class SelfLearningModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIndividualTable: true
    };
  }

  toggleIndividualTable = () => {
    this.setState({
      showIndividualTable: !this.state.showIndividualTable
    });
  };

  getSLModalContent = () => {
    const keyName = this.props.config.serial.coms[1 - this.props.comIndex].name;
    const valueName = this.props.config.serial.coms[this.props.comIndex].name;
    const rounding = this.props.config.serial.coms[this.props.comIndex].digits;

    const individualEntries = [];
    const generalEntries = [];
    const individualColumnHeaders = this.props.individualColumnHeaders;

    for (let key in this.props.generalEntries) {
      generalEntries.push({
        key,
        ...this.props.generalEntries[key]
      });
    }
    for (let key in this.props.individualEntries) {
      individualEntries.push({
        key,
        ...this.props.individualEntries[key]
      });
    }

    const extraColumns = this.props.config.selfLearning.extraColumns.map((column, index) => ({
      Headers: [individualColumnHeaders[index + 2], column.title],
      accessor: row => row.extra[index],
      Cell: props => {
        switch (column.type) {
          case "text":
            return String(props.value).slice(-column.digits);
          case "number":
            return Number(props.value).toFixed(column.digits);
          case "date":
            return dateFormat(daysToDate(Number(props.value)), "dd-mm-yyyy");
          default:
            return props.value;
        }
      },
      width: Math.max(70, 11 * column.title.length),
      generalVisible: column.generalVisible
    }));

    const generalTableColumns = [
      {
        Headers: ["", valueName],
        accessor: row => row.entries[0],
        Cell: props => props.value.toFixed(rounding),
        width: 70
      },
      {
        Headers: ["", "-1"],
        accessor: row => row.entries[1] || "",
        Cell: props => (props.value ? props.value.toFixed(rounding) : ""),
        width: 70
      },
      {
        Headers: ["", "-2"],
        accessor: row => row.entries[2] || "",
        Cell: props => (props.value ? props.value.toFixed(rounding) : ""),
        width: 70
      },
      {
        Headers: ["", "-3"],
        accessor: row => row.entries[3] || "",
        Cell: props => (props.value ? props.value.toFixed(rounding) : ""),
        width: 70
      },
      {
        Headers: ["", "-4"],
        accessor: row => row.entries[4] || "",
        Cell: props => (props.value ? props.value.toFixed(rounding) : ""),
        width: 70
      },
      {
        Headers: ["", keyName],
        accessor: "key",
        width: 200
      },
      ...extraColumns.filter(column => column.generalVisible),
      {
        Headers: [
          "",
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete all general entries?`)) {
                this.props.deleteGeneralSL();
              }
            }}
          >
            <b> Delete </b>
          </button>
        ],
        Cell: props => {
          return (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete general entries for ${props.original.key}?`)) {
                  this.props.deleteGeneralSL(props.original.key);
                }
              }}
            >
              Delete
            </button>
          );
        },
        width: 70
      }
    ];

    const individualTableColumns = [
      {
        Headers: [individualColumnHeaders[0], valueName],
        accessor: "calibration",
        width: 70,
        Cell: props => props.value.toFixed(rounding)
      },
      {
        Headers: [individualColumnHeaders[1], keyName],
        accessor: "key",
        width: 200
      },
      ...extraColumns,
      {
        Headers: ["", "Tol"],
        accessor: "tolerance",
        Cell: props => {
          return (
            <div
              style={{
                backgroundColor: individualColors[Math.min(4, props.original.increments)],
                color: textColors[Math.min(4, props.original.increments)]
              }}
            >
              {props.value.toFixed(1)}{" "}
            </div>
          );
        },
        width: 50
      },
      {
        Headers: [sum(individualEntries.map(entry => entry.numUpdates)), "Num"],
        accessor: "numUpdates",
        width: 50
      },
      {
        Headers: [sum(individualEntries.map(entry => entry.numUpdatesHistory[0])), "-1"],
        accessor: row => row.numUpdatesHistory[0] || "",
        width: 50,
        style: {
          backgroundColor: "#ddd"
        }
      },
      {
        Headers: [sum(individualEntries.map(entry => entry.numUpdatesHistory[1])), "-2"],
        accessor: row => row.numUpdatesHistory[1] || "",
        width: 50,
        style: {
          backgroundColor: "#ddd"
        }
      },
      {
        Headers: [sum(individualEntries.map(entry => entry.numUpdatesHistory[2])), "-3"],
        accessor: row => row.numUpdatesHistory[2] || "",
        width: 50,
        style: {
          backgroundColor: "#ddd"
        }
      }
    ];

    if (this.props.activityCounter) {
      individualTableColumns.push(
        {
          Headers: [sum(individualEntries.map(entry => entry.activity)), "TA"],
          accessor: "activity",
          width: 50
        },
        {
          Headers: [sum(individualEntries.map(entry => entry.activityHistory[0])), "-1"],
          accessor: row => row.activityHistory[0] || "",
          width: 50,
          style: {
            backgroundColor: "#ddd"
          }
        },
        {
          Headers: [sum(individualEntries.map(entry => entry.activityHistory[1])), "-2"],
          accessor: row => row.activityHistory[1] || "",
          width: 50,
          style: {
            backgroundColor: "#ddd"
          }
        },
        {
          Headers: [sum(individualEntries.map(entry => entry.activityHistory[2])), "-3"],
          accessor: row => row.activityHistory[2] || "",
          width: 50,
          style: {
            backgroundColor: "#ddd"
          }
        }
      );
    }

    individualTableColumns.push({
      Headers: [
        "",
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete all individual entries?`)) {
              this.props.deleteIndividualSL();
            }
          }}
        >
          <b> Delete </b>{" "}
        </button>
      ],
      Cell: props => {
        return (
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete the entry for ${props.original.key}?`)) {
                this.props.deleteIndividualSL(props.original.key);
              }
            }}
          >
            {" "}
            Delete{" "}
          </button>
        );
      },
      width: 70
    });

    return (
      <>
        <span>
          <Toggle checked={this.state.showIndividualTable} onChange={this.toggleIndividualTable} />{" "}
          {this.state.showIndividualTable ? " Show SL-list" : " Show UN-list"}{" "}
        </span>{" "}
        <span className="selfLearning--modal--buttons">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset the data of the individual selfLearning?"))
                this.props.resetIndividualSL();
            }}
          >
            <b> Reset </b>{" "}
          </button>{" "}
        </span>{" "}
        {this.state.showIndividualTable ? (
          <>
            <div className="selfLearning--modal--title"> UN - list </div>{" "}
            <ReactTable
              data={individualEntries}
              columns={individualTableColumns}
              style={{
                textAlign: "center"
              }}
            />{" "}
          </>
        ) : (
          <>
            <div className="selfLearning--modal--title"> SL - list </div>{" "}
            <ReactTable
              style={{
                textAlign: "center"
              }}
              data={generalEntries}
              columns={generalTableColumns}
            />{" "}
          </>
        )}{" "}
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
        {this.props.isOpen && this.getSLModalContent()}{" "}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const configLocked = state.config.locked;
  const config = state.config;
  const individual = state.internal.selfLearning.individual;
  const tableExtraColumnTitle = state.config.selfLearning.tableExtraColumnTitle;
  const { activityCounter } = state.config.selfLearning;

  return {
    ...state.internal.selfLearning,
    configLocked,
    config,
    individual,
    tableExtraColumnTitle,
    activityCounter
  };
}

export default connect(
  mapStateToProps,
  { deleteGeneralSL, deleteIndividualSL, resetIndividualSL }
)(SelfLearningModal);
