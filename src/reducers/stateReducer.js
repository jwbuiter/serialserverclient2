const {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE
} = require("../actions/types");

const initialState = {
  coms: ["", ""],
  outputs: [{}],
  inputs: [{}],
  cells: ["", "", "", "", "", "", "", "", "", ""]
};

export default function(fullState = initialState, action) {
  switch (action.type) {
    case INPUT_PORT_STATE: {
      const { index, state, isForced } = action.payload;

      return { ...fullState };
    }
    case OUTPUT_PORT_STATE: {
      const { index, state, result, isForced } = action.payload;

      return { ...fullState };
    }
    case SERIAL_COM_STATE: {
      const { index, entry } = action.payload;

      return { ...fullState };
    }
    case TABLE_CELL_STATE: {
      const { index, entry, manual } = action.payload;

      return { ...fullState };
    }
    default:
      return fullState;
  }
}
