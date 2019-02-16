import React from "react";
import FitText from "react-fittext";
import classnames from "classnames";

import { daysToDate } from "../helpers";

import "../styles/tableCell.scss";

const TableCell = props => {
  const { index, cell } = props;
  let content;
  switch (cell.type) {
    case "manual": {
      content = (
        <input
          type={props.cell.numeric ? "number" : "text"}
          className={classnames(
            "tableCell--content--input",
            { "tableCell--content--input--text": !cell.numeric },
            { "tableCell--content--input--numeric": cell.numeric }
          )}
          onChange={e => props.manualFunction(index, e.target.value)}
          value={cell.value}
        />
      );
      if (props.cell.numeric) {
        const decrement = () => {
          props.manualFunction(index, Number(cell.value) - 1);
        };
        const increment = () => {
          props.manualFunction(index, Number(cell.value) + 1);
        };

        content = (
          <>
            <button onClick={decrement}>-</button>
            {content}
            <button onClick={increment}>+</button>
          </>
        );
      }
      break;
    }
    case "menu": {
      const menuOptions = cell.menuOptions || [];

      content = (
        <select
          className={classnames(
            "tableCell--content--input",
            { "tableCell--content--input--text": !cell.numeric },
            { "tableCell--content--input--numeric": cell.numeric }
          )}
          onChange={e => props.manualFunction(index, e.target.value)}
          value={cell.value}
        >
          {menuOptions.map(option => (
            <option value={option.key}>{option.value}</option>
          ))}
        </select>
      );

      if (cell.numeric) {
        const decrement = () => {
          let newMenuIndex =
            menuOptions.findIndex(option => option.key === Number(cell.value)) -
            1;

          if (newMenuIndex < 0) newMenuIndex = menuOptions.length - 1;

          props.manualFunction(index, menuOptions[newMenuIndex].key);
        };
        const increment = () => {
          let newMenuIndex =
            menuOptions.findIndex(option => option.key === Number(cell.value)) +
            1;
          console.log({ menuOptions, val: cell.value });
          if (newMenuIndex === 0 || newMenuIndex === menuOptions.length)
            newMenuIndex = 0;

          props.manualFunction(index, menuOptions[newMenuIndex].key);
        };

        content = (
          <>
            <button onClick={decrement}>-</button>
            {content}
            <button onClick={increment}>+</button>
          </>
        );
      }
      break;
    }
    case "date": {
      if (!cell.value || cell.value === "0") {
        content = "";
        break;
      }
      const date = daysToDate(cell.value);

      content = `${date.getDate()}-${date.getMonth() +
        1}-${date.getFullYear()}`;
      break;
    }
    default: {
      content = cell.value;
      break;
    }
  }

  return (
    <div
      className={classnames("tableCell", {
        "tableCell--notFound": props.notFound
      })}
    >
      <div className="tableCell--title" onClick={props.openModal}>
        <FitText>
          <div className="center">{cell.name}</div>
        </FitText>
      </div>
      <div className="tableCell--content">
        <FitText compressor={0.6}>
          <div className="center">{content}</div>
        </FitText>
      </div>
    </div>
  );
};

export default TableCell;
