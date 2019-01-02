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
    this.state = { modalIsOpen: false };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const indicators = [
      "selfLearning--title--inProgress",
      "selfLearning--title--success",
      "selfLearning--title--warning"
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

    return (
      <>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
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
        <div className="selfLearning" onClick={this.openModal}>
          <div
            className={"selfLearning--title " + indicators[this.props.success]}
          >
            <div className="center">
              <FitText>
                <div>Self Learning</div>
              </FitText>
            </div>
          </div>
          <div className="selfLearning--content">
            {this.props.individual ? (
              <div className="center">
                <FitText>
                  <div>
                    {this.props.calibration} ±{" "}
                    {(this.props.tolerance * 100).toFixed(1)} %
                  </div>
                </FitText>
              </div>
            ) : (
              <div className="center">
                <FitText>
                  <div>
                    {this.props.calibration} ±{" "}
                    {(this.props.matchedTolerance * 100).toFixed(1)} %
                  </div>
                </FitText>
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
