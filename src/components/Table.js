import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import TableCell from "./TableCell";

import "../styles/table.scss";

Modal.setAppElement("#root");

class Table extends Component {
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
    const filteredCells = this.props.cells.filter((cell, index) => {
      return index < 1;
    });

    return (
      <>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Table Configuration Modal"
        >
          d
        </Modal>
        <div className={`table--grid table--grid--${filteredCells.length}`}>
          {filteredCells.map((cell, index) => (
            <TableCell
              key={index}
              name={cell.name}
              value={cell.value}
              index={index}
              type={cell.manual ? "menuNumeric" : "text"}
              menuOptions={[
                { value: 1, description: "small" },
                { value: 3, description: "big" }
              ]}
              manualFunction={this.props.api.tableManual}
              openLog={this.props.openLog}
            />
          ))}
        </div>
      </>
    );
  }
}

export default Table;
