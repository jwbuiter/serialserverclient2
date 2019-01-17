import React from "react";
import FitText from "react-fittext";
import classnames from "classnames";

import "../styles/tableCell.scss";

const TableCell = props => {
  const { index, cell } = props;
  console.log(cell.type);
  let content;
  switch (cell.type) {
    case "manual": {
      content = (
        <input
          type="text"
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
      console.log(cell.formula);
      const menuOptions = (cell.formula.match(/{[0-9\.]+:\w+}/g) || []).map(
        str => {
          const parts = str.split(":");
          return {
            value: Number(parts[0].slice(1)),
            description: parts[1].slice(0, -1)
          };
        }
      );

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
            <option value={option.value}>{option.description}</option>
          ))}
        </select>
      );

      if (cell.numeric) {
        const decrement = () => {
          let newMenuIndex =
            props.menuOptions.findIndex(
              option => option.value === props.value
            ) - 1;

          if (newMenuIndex < 0) newMenuIndex = 0;

          props.manualFunction(index, menuOptions[newMenuIndex].value);
        };
        const increment = () => {
          let newMenuIndex =
            menuOptions.findIndex(option => option.value === cell.value) + 1;

          if (newMenuIndex === 0 || newMenuIndex === menuOptions.length)
            newMenuIndex = menuOptions.length - 1;

          props.manualFunction(index, menuOptions[newMenuIndex].value);
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
