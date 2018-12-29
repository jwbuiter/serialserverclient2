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
      return { loaded: true, ...action.payload };
    }
    case CONFIG_UNLOCK: {
      return { locked: false, ...state };
    }
    case CONFIG_LOCK: {
      return { locked: true, ...state };
    }
    case CONFIG_CHANGE: {
      if (state.locked) return state;

      return { hasChanged: true, ...state };
    }
    default:
      return state;
  }
}
