import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import FitText from "react-fittext";

import "../styles/selfLearning.scss";
import "react-table/react-table.css";

const generalTableColumns = [
  {
    Header: "Com0",
    accessor: row => row.entries[0],
    id: 1
  },
  {
    Header: "-1",
    accessor: row => row.entries[1],
    id: 2
  },
  {
    Header: "-2",
    accessor: row => row.entries[2],
    id: 3
  },
  {
    Header: "-3",
    accessor: row => row.entries[3],
    id: 4
  },
  {
    Header: "-4",
    accessor: row => row.entries[4],
    id: 5
  },
  {
    Header: "Com1",
    accessor: "key",
    width: 300
  }
];

const individualColors = ["", "green", "yellow", "orange", "red"];
const textColors = ["black", "white", "black", "black", "white"];

const individualTableColumns = [
  {
    Header: "Com0",
    accessor: "calibration"
  },
  {
    Header: "Com1",
    accessor: "key"
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
    }
  },
  {
    Header: "Num",
    accessor: "numUpdates"
  },
  {
    Header: props => <button>Delete</button>,
    Cell: props => <button>Delete</button>,
    id: 1
  }
];

const data = [{ entries: [23, 24, 342, 3545, 1231], key: 543210987654321 }];
const data2 = [
  {
    calibration: 25.5,
    key: 543210987654321,
    tolerance: 9,
    increments: 4,
    numUpdates: 0
  },
  {
    calibration: 25.5,
    key: 543210987654321,
    tolerance: 8,
    increments: 3,
    numUpdates: 0
  },
  {
    calibration: 25.5,
    key: 543210987654321,
    tolerance: 7,
    increments: 2,
    numUpdates: 0
  },
  {
    calibration: 25.5,
    key: 543210987654321,
    tolerance: 6,
    increments: 1,
    numUpdates: 0
  },
  {
    calibration: 25.5,
    key: 543210987654321,
    tolerance: 5,
    increments: 0,
    numUpdates: 0
  }
];

Modal.setAppElement("#root");

class SelfLearning extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    const indicators = [
      "selfLearning--indicator--inProgress",
      "selfLearning--indicator--success",
      "selfLearning--indicator--warning"
    ];
    return (
      <>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Example Modal"
        >
          <div className="selfLearning--modal">
            <div>SL: Ind COM0</div>
            <div>
              <span> SL-list </span>
              <ReactTable
                data={data || Object.entries(this.props.generalEntries)}
                columns={generalTableColumns}
              />
            </div>
            <div>
              <span> UN-list </span>
              <ReactTable
                data={data2 || Object.entries(this.props.individualEntries)}
                columns={individualTableColumns}
              />
            </div>
          </div>
        </Modal>
        <div className="selfLearning" onClick={this.openModal}>
          <div className="selfLearning--title">
            <div className="center">
              <FitText>
                <div>Self Learning</div>
              </FitText>
              <div
                className={
                  "center-vertical selfLearning--indicator " +
                  indicators[this.props.success]
                }
              />
            </div>
          </div>
          <div className="selfLearning--content">
            {this.props.individual ? (
              <div className="center-vertical">
                {this.props.calibration} ±{" "}
                {(this.props.tolerance * 100).toFixed(1)} %
              </div>
            ) : (
              <div className="center-vertical">
                {this.props.calibration} ±{" "}
                {(this.props.matchedTolerance * 100).toFixed(1)} %
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return { ...state.internal.selfLearning };
}

export default connect(mapStateToProps)(SelfLearning);
