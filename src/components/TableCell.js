import React from "react";
import FitText from "react-fittext";

import "../styles/tableCell.scss";

const TableCell = props => {
  const { index } = props;

  let content;
  switch (props.type) {
    case "manualText": {
      content = (
        <input
          type="text"
          className="tableCell--content--input tableCell--content--input--text"
          onChange={e => props.manualFunction(index, e.target.value)}
          value={props.value}
        />
      );
      break;
    }
    case "manualNumeric": {
      const decrement = () => {
        props.manualFunction(index, Number(props.value) - 1);
      };
      const increment = () => {
        props.manualFunction(index, Number(props.value) + 1);
      };

      content = (
        <>
          <button onClick={decrement}>-</button>
          <input
            type="number"
            className="tableCell--content--input tableCell--content--input--numeric"
            onChange={e => props.manualFunction(index, e.target.value)}
            value={props.value}
          />
          <button onClick={increment}>+</button>
        </>
      );
      break;
    }
    case "menuText": {
      content = (
        <select
          className="tableCell--content--input tableCell--content--input--text"
          onChange={e => props.manualFunction(index, e.target.value)}
          value={props.value}
        >
          {props.menuOptions.map(option => (
            <option value={option.value}>{option.description}</option>
          ))}
        </select>
      );
      break;
    }
    case "menuNumeric": {
      const decrement = () => {
        let newMenuIndex =
          props.menuOptions.findIndex(option => option.value === props.value) -
          1;

        if (newMenuIndex < 0) newMenuIndex = 0;

        props.manualFunction(index, props.menuOptions[newMenuIndex].value);
      };
      const increment = () => {
        let newMenuIndex =
          props.menuOptions.findIndex(option => option.value === props.value) +
          1;

        if (newMenuIndex === 0 || newMenuIndex === props.menuOptions.length)
          newMenuIndex = props.menuOptions.length - 1;

        props.manualFunction(index, props.menuOptions[newMenuIndex].value);
      };

      content = (
        <>
          <button onClick={decrement}>-</button>
          <select
            className="tableCell--content--input tableCell--content--input--numeric"
            onChange={e => props.manualFunction(index, e.target.value)}
            value={props.value}
          >
            {props.menuOptions.map(option => (
              <option value={option.value}>{option.description}</option>
            ))}
          </select>
          <button onClick={increment}>+</button>
        </>
      );
      break;
    }
    case "text":
    case "numeric": {
      content = props.value;
      break;
    }
  }

  return (
    <div className="tableCell">
      <div className="tableCell--title" onClick={props.openLog}>
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
