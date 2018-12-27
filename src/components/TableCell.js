import React from "react";
import FitText from "react-fittext";

import "../styles/tableCell.scss";

const TableCell = props => {
  let content;
  if (props.manual) {
    if (true) {
      content = (
        <>
          <button className="leftButton">-</button>
          <input className="numeric" />
          <button className="rightButton">+</button>
        </>
      );
    }
  } else {
    content = props.value;
  }

  return (
    <div className="tableCell" onClick={props.openLog}>
      <div className="tableCell--title">
        <FitText>
          <div className="center">{props.name}</div>
        </FitText>
      </div>
      <div className="tableCell--content">
        <FitText compressor={0.4}>
          <div className="center">{content}</div>
        </FitText>
      </div>
    </div>
  );
};

export default TableCell;
