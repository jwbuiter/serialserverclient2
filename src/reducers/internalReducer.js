const {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  SELFLEARNING_STATE
} = require("../actions/types");

const initialState = {
  coms: [],
  outputs: [],
  inputs: [],
  cells: [],
  selfLearning: {
    enabled: false
  }
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
      newComs[index] = { entry, entryTime };

      return { ...fullState, coms: newComs };
    }
    case TABLE_CELL_STATE: {
      const { index, value, manual } = action.payload;

      const newCells = Array.from(fullState.cells);
      newCells[index] = { value, manual };

      return { ...fullState, cells: newCells };
    }
    case SELFLEARNING_STATE: {
      console.log(action.payload);
      return {
        ...fullState,
        selfLearning: { enabled: true, ...action.payload }
      };
    }
    default:
      return fullState;
  }
}
