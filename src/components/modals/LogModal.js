import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTable from "react-table";
import dateFormat from "dateformat";
import XLSX from "xlsx";

import { getColumnWidth, daysToDate } from "../../helpers";

class LogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: "full",
    };
  }

  changeFilterType = (event) => {
    this.setState({ filterType: event.target.value });
  };

  filterTypes = [
    {
      id: "full",
      name: "Show only complete",
      title: "Complete Log",
      filter: (entry) => entry.full,
    },
  ];

  componentWillMount() {
    if (this.props.uniqueLogEnabled) {
      this.filterTypes.push({
        id: "unique",
        name: "Show only unique",
        title: "Unique Log",
        filter: (entry) => entry.TU,
      });
    }

    if (this.props.activityCounter) {
      this.filterTypes.push({
        id: "activity",
        name: "Show only activity",
        title: "Activity Log",
        filter: (entry) => entry.TA,
      });
    }
    this.filterTypes.push({
      id: "none",
      name: "Show all",
      title: "Normal Log",
      filter: (entry) => true,
    });
  }

  render() {
    const currentFilter = this.filterTypes.find((filter) => filter.id === this.state.filterType);

    const { entries, accessors, legend, visible } = this.props.loggerState;
    const { cells } = this.props.config.table;

    const dateCells = new Set();
    cells.forEach((cell, i) => {
      if (cell.type == "date") dateCells.insert(`cells[${i}]`);
    });

    const columns = legend
      .map((name, index) => {
        const column = {
          Header: () => <b>{name}</b>,
          accessor: accessors[index],
          width: getColumnWidth(entries, accessors[index]),
          style: { textAlign: "center" },
          id: index,
          Cell: (props) => {
            return props.value;
          },
          name,
        };

        const accessor = column.accessor;
        if (dateCells.has(accessor)) {
          column.accessor = (row) => {
            const excelDate = eval("row." + accessor);
            return dateFormat(daysToDate(excelDate), "yyyy-mm-dd HH-MM-ss");
          };
        }

        return column;
      })
      .filter((_, index) => visible[index])
      .filter((column) => this.props.uniqueLogEnabled || column.name !== "TU")
      .filter((column) => this.props.activityCounter || column.name !== "TA");

    const filteredEntries = entries.filter(currentFilter.filter);

    const downloadLog = () => {
      const table = [];
      table[0] = columns.map((col) => col.name);

      for (let row of filteredEntries) {
        const newRow = [];
        for (let col of columns) {
          const entry = typeof col.accessor == "function" ? col.accessor() : eval("row." + col.accessor);
          newRow.push(entry);
        }
        table.push(newRow);
      }

      const ws = XLSX.utils.aoa_to_sheet(table);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "data");

      const date = dateFormat(new Date(), "yyyy-mm-dd_HH-MM-ss");

      XLSX.writeFile(wb, `${this.props.name}_${this.props.config.logger.logID}_${date}.xlsx`);
    };

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        overlayClassName="modalOverlay"
        className="modalContent"
        contentLabel="Log Modal"
      >
        {this.filterTypes.length > 1 && (
          <span>
            <select value={this.state.filterType} onChange={this.changeFilterType}>
              {this.filterTypes.map((filter) => (
                <option value={filter.id}>{filter.name}</option>
              ))}
            </select>
          </span>
        )}
        {entries.length > 0 && (
          <span className="selfLearning--modal--buttons">
            <button onClick={downloadLog}>
              <b> Download </b>
            </button>
            <button onClick={window.print}>
              <b> Print </b>
            </button>
          </span>
        )}

        <div className="main--logModal">
          <div>
            <div className="main--logModal--title">
              <b>{currentFilter.title}</b>
            </div>
            <ReactTable style={{ fontSize: 14 }} data={filteredEntries} columns={columns} />
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const uniqueLogEnabled = state.config.logger.unique !== "off";
  const name = state.static.name;
  const config = state.config;

  const { activityCounter } = state.config.selfLearning;

  const loggerState = state.internal.logger;

  return {
    uniqueLogEnabled,
    activityCounter,
    loggerState,
    name,
    config,
  };
}

export default connect(mapStateToProps)(LogModal);
