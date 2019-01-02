const {
  RECEIVE_CONFIG,
  CONFIG_UNLOCK,
  CONFIG_LOCK,
  CONFIG_CHANGE
} = require("../actions/types");

const initialState = { loaded: false, locked: true, hasChanged: false };

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONFIG: {
      return { ...state, loaded: true, ...action.payload };
    }
    case CONFIG_UNLOCK: {
      return { ...state, locked: false };
    }
    case CONFIG_LOCK: {
      return { ...state, locked: true };
    }
    case CONFIG_CHANGE: {
      if (state.locked) return state;

      return { ...state, hasChanged: true, ...state };
    }
    default:
      return state;
  }
}
