import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import TableCell from "./TableCell";
import { makeForm } from "../configHelper";
import "../styles/table.scss";

Modal.setAppElement("#root");

const configurationValues = {
  table: {
    cells: [
      {
        name: {
          name: "Name of cell",
          type: "text"
        },
        formula: {
          name: "Formula for cell value",
          type: "text"
        },
        numeric: {
          name: "Treat value as a number",
          type: "checkbox"
        },
        digits: {
          name: "Number of digits",
          type: "number",
          min: 0,
          step: 1
        },
        resetOnExe: {
          name: "Reset value after execute",
          type: "checkbox"
        }
      }
    ]
  }
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = { configModalIsOpen: false, configCellIndex: -1 };
  }

  openConfigModal = index => {
    this.setState({ configModalIsOpen: true, configCellIndex: index });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  render() {
    const filteredCells = this.props.cells.filter((cell, index) => {
      return index < 10;
    });

    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="Table Configuration Modal"
        >
          <form onChange={this.props.api.changeConfig}>
            <h2>
              Configuration for cell{" "}
              {String.fromCharCode(
                65 + Math.floor(this.state.configCellIndex / 5)
              )}
              {(this.state.configCellIndex % 5) + 1}
            </h2>
            {makeForm(
              configurationValues,
              this.props.config,
              this.state.configCellIndex
            )}
          </form>
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
                { value: 1, description: "smeeeeeeeeeeeall" },
                { value: 3, description: "big" }
              ]}
              manualFunction={this.props.api.tableManual}
              openModal={
                this.props.configLocked
                  ? this.props.openLog
                  : () => this.openConfigModal(index)
              }
            />
          ))}
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const cells = state.internal.cells.map((cell, index) => ({
    ...cell,
    name: state.config.table.cells[index].name
  }));

  return {
    cells,
    configLocked: state.config.locked,
    config: state.config
  };
}

export default connect(mapStateToProps)(Table);
