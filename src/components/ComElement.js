import React from "react";
import FitText from "react-fittext";
import "../styles/comElement.scss";

const ComElement = props => {
  return (
    <div className="comElement">
      <div className="comElement--title">
        <div className="center">
          <FitText>
            <div>{props.name}</div>
          </FitText>
          <FitText compressor={2}>
            <div>{props.average && `Average ${props.entries}`}</div>
          </FitText>
        </div>
      </div>
      <div className="comElement--content">
        <FitText>
          <div className="center">{props.entry}</div>
        </FitText>
      </div>
    </div>
  );
};

export default ComElement;
