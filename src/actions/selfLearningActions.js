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
  () =>
  (dispatch, getState, { emit }) => {
    if (window.confirm("This will clear the Excel file. Do you want to download it first?")) {
      return;
    }

    const config = getState().config;
    let { logID } = config.logger;
    let { startCalibration, totalNumber } = config.selfLearning;

    if (window.confirm("Are you sure you want to clear all SL data?")) {
      emit("deleteSLData", { logID, startCalibration, totalNumber }, (success) => {
        if (success) {
          const hardReboot = getState().static.newCycleResetHard;
          const message = hardReboot
            ? "Successfully started new cycle, device will now reboot"
            : "Successfully started new cycle";

          window.alert(message);

          if (hardReboot) emit("hardReboot");
        }
      });
    }
  };
