export const deleteGeneralSL = key => (dispatch, getState, { emit }) => {
  emit("deleteGeneralSL", key);
};

export const deleteIndividualSL = key => (dispatch, getState, { emit }) => {
  emit("deleteIndividualSL", key);
};

export const resetIndividualSL = () => (dispatch, getState, { emit }) => {
  emit("resetIndividualSL");
};

export const resetSLData = () => (dispatch, getState, { emit }) => {
  if (window.confirm("This will clear the Excel file. Do you want to download it first?")) {
    return;
  }
  if (window.confirm("Are you sure you want to clear all SL data?")) {
    emit("deleteSLData");
  }
};
