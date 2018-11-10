import React from "react";
import "../styles/tableCell.scss";

const TableCell = props => {
  return (
    <div className="tableCell">
      <div className="tableCell--title">
        <div className="center">{props.name}</div>
      </div>
      <div className="tableCell--content">
        <div className="center">{props.content}</div>
      </div>
    </div>
  );
};

export default TableCell;
