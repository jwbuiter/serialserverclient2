import React from "react";
import FitText from "react-fittext";
import "../styles/selfLearning.scss";

const SelfLearning = props => {
  const indicator = "selfLearning--indicator--inProgress";
  return (
    <div className="selfLearning">
      <div className="selfLearning--title">
        <div className="center">
          <FitText>
            <div>Self Learning</div>
          </FitText>
        </div>
      </div>
      <div className="selfLearning--content">
        <div className="center-vertical">25.0 ± 37.5%</div>
        <div
          className={"center-vertical selfLearning--indicator " + indicator}
        />
      </div>
    </div>
  );
};

export default SelfLearning;
