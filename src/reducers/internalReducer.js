const dateformat = require("dateformat");

const {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  SELFLEARNING_STATE,
  TABLE_FOUND_STATE
} = require("../actions/types");

const initialState = {
  coms: [],
  outputs: [],
  inputs: [],
  cells: [],
  selfLearning: {
    enabled: false
  },
  tableNotFound: false
};

export default function(fullState = initialState, action) {
  switch (action.type) {
    case INPUT_PORT_STATE: {
      const { index, state, isForced } = action.payload;

      const newInputs = Array.from(fullState.inputs);
      newInputs[index] = { state, isForced };

      return { ...fullState, inputs: newInputs };
    }
    case OUTPUT_PORT_STATE: {
      const { index, state, result, isForced } = action.payload;

      const newOutputs = Array.from(fullState.outputs);
      newOutputs[index] = { state, result, isForced };

      return { ...fullState, outputs: newOutputs };
    }
    case SERIAL_COM_STATE: {
      const { index, entry, entryTime } = action.payload;

      const newComs = Array.from(fullState.coms);
      let newHistory;
      if (!fullState.coms[index]) fullState.coms[index] = { history: [] };

      if (!entry) {
        newHistory = fullState.coms[index].history;
      } else {
        newHistory = [
          {
            entry,
            entryTime,
            timeString: dateformat(new Date(entryTime), "HH:MM:ss")
          },
          ...fullState.coms[index].history
        ];
      }

      newComs[index] = {
        entry,
        entryTime,
        history: newHistory
      };

      return { ...fullState, coms: newComs };
    }
    case TABLE_CELL_STATE: {
      const { index, value, manual } = action.payload;

      const newCells = Array.from(fullState.cells);
      newCells[index] = { value, manual };

      return { ...fullState, cells: newCells };
    }
    case SELFLEARNING_STATE: {
      return {
        ...fullState,
        selfLearning: { enabled: true, ...action.payload }
      };
    }
    case TABLE_FOUND_STATE: {
      return {
        ...fullState,
        tableNotFound: action.payload
      };
    }
    default:
      return fullState;
  }
}
