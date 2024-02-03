import io from "socket.io-client";
import { transferExcel } from "./excelActions";

export const deleteGeneralSL =
  (key) =>
  (dispatch, getState, { emit }) => {
    emit("deleteGeneralSL", { key });
  };

export const deleteIndividualSL =
  (key, message) =>
  (dispatch, getState, { emit }) => {
    emit("deleteIndividualSL", { key, message }, (totalNumber) =>
      window.alert(`Total SL number has been lowered from ${totalNumber + 1} to ${totalNumber}`)
    );
  };

export const resetIndividualSL =
  () =>
  (dispatch, getState, { emit }) => {
    emit("resetIndividualSL");
  };

export const resetSLData =
  (target, name) =>
  async (dispatch, getState, { emit }) => {
    if (target != "") {
      const socket = io(target);

      await new Promise((r) => setTimeout(r, 1000));
      if (!socket.connected) {
        window.alert("Could not connect to " + name);
        return;
      }

      emit = (msg, data, callback) => socket.emit(msg, data, callback);
    } else if (window.confirm("This will clear the Excel file. Do you want to download it first?")) {
      return;
    }

    const config = getState().config;
    let { logID } = config.logger;
    let { startCalibration, totalNumber } = config.selfLearning;

    if (window.confirm(`Are you sure you want to clear all SL data${target == "" ? "" : " on " + name}?`)) {
      emit("deleteSLData", { logID, startCalibration, totalNumber }, async (success) => {
        if (!success) {
          window.alert("Failed to reset SL data");
          return;
        }

        if (target != "") {
          await transferExcel(target);
          // wait a few seconds to allow soft reboot to complete
          await new Promise((r) => setTimeout(r, 5000));
        }

        const hardReboot = getState().static.newCycleResetHard;
        const message = hardReboot
          ? "Successfully started new cycle, device will now reboot"
          : "Successfully started new cycle";

        window.alert(message);

        if (hardReboot) emit("hardReboot");

        window.location.reload();
      });
    }
  };
