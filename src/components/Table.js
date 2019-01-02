import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import TableCell from "./TableCell";

import "../styles/table.scss";

Modal.setAppElement("#root");

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

  formChanged = event => {
    const property = event.target.name;
    let value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (!isNaN(Number(event.target.value))) {
      value = Number(event.target.value);
    } else {
      value = event.target.value;
    }
    console.log({ property, value });
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
          <form onChange={this.formChanged}>
            <h2>Configuration for whole table</h2>
            Trigger:
            <select name={`table.trigger`}>
              <option value={0}>Com 0</option>
              <option value={1}>Com 1</option>
            </select>
            <br />
            Use imported file:
            <input type="checkbox" name={`table.useFile`} />
            <br />
            Wait for other com:
            <input type="checkbox" name={`table.waitForOther`} />
            <br />
            Column to search in:
            <input type="number" min="0" step="1" name={`table.searchColumn`} />
            <br />
            <h2>Configuration for cell {this.state.configCellIndex}</h2>
            Type of content:
            <select name={`table.cells[${this.state.configCellIndex}].type`}>
              <option value="">Normal</option>
              <option value="date">Date</option>
              <option value="manual">Manual</option>
              <option value="menu">Selectable</option>
            </select>
            <br />
            Name of cell:
            <input
              type="text"
              name={`table.cells[${this.state.configCellIndex}].name`}
            />
            <br />
            Formula for cell value:
            <input
              type="text"
              name={`table.cells[${this.state.configCellIndex}].formula`}
            />
            <br />
            Formula for cell Color:
            <input
              type="text"
              name={`table.cells[${this.state.configCellIndex}].colorFormula`}
            />
            <select name={`table.cells[${this.state.configCellIndex}].type`}>
              <option value="">Green</option>
              <option value="date">Yellow</option>
              <option value="manual">Orange</option>
              <option value="menu">Red</option>
            </select>
            <br />
            Treat value as a number:
            <input
              type="checkbox"
              name={`table.cells[${this.state.configCellIndex}].numeric`}
            />
            <br />
            Number of digits:
            <input
              type="number"
              min="0"
              step="1"
              name={`table.cells[${this.state.configCellIndex}].digits`}
            />
            <br />
            Reset value after execute:
            <input
              type="checkbox"
              name={`table.cells[${this.state.configCellIndex}].numeric`}
            />
            <br />
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
  return {
    configLocked: state.config.locked
  };
}

export default connect(mapStateToProps)(Table);
