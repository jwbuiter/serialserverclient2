import React from "react";
import "../styles/comElement.scss";

const ComElement = props => {
  return (
    <div className="comElement">
      <div className="comElement--title">
        <div className="center">{props.name}</div>
      </div>
      <div className="comElement--content">
        <div className="center">
          {props.entry}
          {/*<span className="comElement--content--unit">
            {props.content.unit}
          </span>
          <br />
          <span className="comElement--content--comment">
            {props.content.comment}
          </span>
          */}
        </div>
      </div>
    </div>
  );
};

export default ComElement;