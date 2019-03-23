import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import FitText from "react-fittext";
import classNames from "classnames";

import SelfLearningModal from "./modals/SelfLearningModal";

import { makeForm } from "../helpers";
import "../styles/selfLearning.scss";
import "react-table/react-table.css";
import { isUndefined } from "util";

Modal.setAppElement("#root");

class SelfLearning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SLModalIsOpen: false,
      configModalIsOpen: false,
      showIndividualTable: false
    };
  }

  openSLModal = () => {
    this.setState({ SLModalIsOpen: true });
  };

  closeSLModal = () => {
    this.setState({ SLModalIsOpen: false });
  };

  openConfigModal = () => {
    this.setState({ configModalIsOpen: true });
  };

  closeConfigModal = () => {
    this.setState({ configModalIsOpen: false });
  };

  render() {
    let rounding = 0;
    if (!isUndefined(this.props.comIndex))
      rounding = this.props.config.serial.coms[this.props.comIndex].digits;

    const configurationValues = {
      selfLearning: {
        enabled: {
          name: "Enabled type",
          type: "select",
          options: {
            off: "Off",
            com0: "Com 0",
            com1: "Com 1",
            com0ind: "Com 0 Individual",
            com1ind: "Com 1 Individual"
          }
        },
        number: {
          name: "Number",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled !== "off"
        },
        startCalibration: {
          name: "Calibration",
          type: "number",
          min: 0,
          step: 1,
          rounding,
          condition: config => config.selfLearning.enabled !== "off"
        },
        tolerance: {
          name: "Tolerance %",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled !== "off"
        },
        startTolerance: {
          name: "Extra tolerance during learning %",
          type: "number",
          min: 0,
          step: 1,
          condition: config =>
            config.selfLearning.enabled !== "off" &&
            !config.selfLearning.enabled.endsWith("ind")
        },
        individualToleranceAbs: {
          name: "Individual tolerance",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled.endsWith("ind")
        },
        individualTolerance: {
          name: "Individual tolerance %",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled.endsWith("ind")
        },
        individualCorrectionIncrement: {
          name: "Correction %",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled.endsWith("ind")
        },
        individualCorrectionLimit: {
          name: "Correction limit (max 9)",
          type: "number",
          min: 0,
          max: 9,
          step: 1,
          condition: config => config.selfLearning.enabled.endsWith("ind")
        },
        tableExtraColumnTitle: {
          name: "Extra column title",
          type: "text",
          condition: config => config.selfLearning.enabled.endsWith("ind")
        },
        tableExtraColumn: {
          name: "Extra column number",
          type: "number",
          min: 0,
          step: 1,
          condition: config => config.selfLearning.enabled.endsWith("ind")
        }
      }
    };

    const indicators = [
      "selfLearning--inProgress",
      "selfLearning--success",
      "selfLearning--warning"
    ];

    const cells = [
      "Self Learning",
      (this.props.calibration || 0).toFixed(
        this.props.config.serial.coms[this.props.comIndex || 0].digits
      ) || 0,
      Math.round((this.props.tolerance || 0) * 1000) / 10 + "%"
    ];

    if (!this.props.individual && this.props.success) {
      cells.push(
        Math.round(
          (this.props.tolerance || 0 - this.props.matchedTolerance || 0) * 1000
        ) /
          10 +
          "%"
      );
    }
    return (
      <>
        <Modal
          isOpen={this.state.configModalIsOpen}
          onRequestClose={this.closeConfigModal}
          overlayClassName="modalOverlay"
          className="modalContent"
          contentLabel="SelfLearning Configuration Modal"
        >
          {this.state.configModalIsOpen && (
            <form>
              <h2>Configuration for SelfLearning</h2>
              {makeForm(configurationValues, this.props.config, this.props.api)}
            </form>
          )}
        </Modal>
        <SelfLearningModal
          isOpen={this.state.SLModalIsOpen}
          onClose={this.closeSLModal}
          api={this.props.api}
        />

        <div
          className={classNames(
            "selfLearning",
            indicators[this.props.success || 0]
          )}
          onClick={
            this.props.configLocked
              ? this.props.individual
                ? this.openSLModal
                : null
              : this.openConfigModal
          }
        >
          {cells.map((cell, index) => (
            <div key={index} className={"selfLearning--cell"}>
              <div className="center">
                <FitText compressor={0.65}>
                  <div>{cell}</div>
                </FitText>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  const configLocked = state.config.locked;
  const config = state.config;
  const individual = state.internal.selfLearning.individual;
  const tableExtraColumnTitle = state.config.selfLearning.tableExtraColumnTitle;

  return {
    ...state.internal.selfLearning,
    configLocked,
    config,
    individual,
    tableExtraColumnTitle
  };
}

export default connect(mapStateToProps)(SelfLearning);
