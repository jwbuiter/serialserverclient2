const { RECEIVE_CONFIG, CONFIG_UNLOCK, CONFIG_LOCK, CONFIG_CHANGE } = require("../actions/types");

const { set } = require("../helpers");

const initialState = { loaded: false, locked: true, hasChanged: false };

function mergeConfig(template, config) {
  if (config === undefined) return template;
  if (template === undefined) return config;

  if (typeof template !== "object") return config;

  let result;
  if (Array.isArray(template)) {
    result = [];
    let longest = Math.max(template.length, config.length);
    for (let i = 0; i < longest; i++) result[i] = mergeConfig(template[i], config[i]);
  } else {
    result = {};
    for (const key in template) {
      result[key] = mergeConfig(template[key], config[key]);
    }
  }

  return result;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONFIG: {
      return { ...action.payload, ...mergeConfig(state, action.payload), loaded: true, hasChanged: true };
    }
    case CONFIG_UNLOCK: {
      return { ...state, locked: false, hasChanged: false };
    }
    case CONFIG_LOCK: {
      return { ...state, locked: true };
    }
    case CONFIG_CHANGE: {
      if (state.locked) return state;

      const { address, value } = action.payload;

      set(state, address, value);

      return { ...state, hasChanged: true };
    }
    default:
      return state;
  }
}
