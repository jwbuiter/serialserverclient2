import socketIOClient from "socket.io-client";
import axios from "axios";

import {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  SELFLEARNING_STATE,
  RECEIVE_IP,
  RECEIVE_TIME,
  TOGGLE_MENU,
  CONFIG_UNLOCK,
  CONFIG_LOCK,
  CONFIG_CHANGE,
  RECEIVE_CONFIG,
  RECEIVE_STATIC
} from "./actions/types";

function api(store) {
  const socket = socketIOClient();

  const messageTypes = {
    input: INPUT_PORT_STATE,
    output: OUTPUT_PORT_STATE,
    table: TABLE_CELL_STATE,
    entry: SERIAL_COM_STATE,
    selfLearning: SELFLEARNING_STATE,
    ip: RECEIVE_IP,
    time: RECEIVE_TIME
  };

  for (let message in messageTypes) {
    socket.on(message, payload => {
      store.dispatch({ type: messageTypes[message], payload });
    });
  }

  function loadConfig() {
    axios
      .get("/config")
      .then(result => {
        console.log("Got config");
        store.dispatch({ type: RECEIVE_CONFIG, payload: result.data });
      })
      .catch(err => console.log("/config", err));
  }

  function loadStatic() {
    axios.get("/static").then(result => {
      console.log("Got static");
      store.dispatch({ type: RECEIVE_STATIC, payload: result.data });
    });
  }

  function forceInput(index) {
    console.log("forceinput", index);
    socket.emit("forceInput", index);
  }

  function forceOutput(index) {
    console.log("forceoutput", index);
    socket.emit("forceOutput", index);
  }

  function tableManual(index, value) {
    socket.emit("manual", { index, value });
  }

  function getLog() {
    return axios.get("/comlog");
  }

  function getUniqueLog() {
    return axios.get("/comlogu");
  }

  function reboot() {
    axios.get("/restart");
    setTimeout(() => {
      loadConfig();
      console.log("test");
    }, 5000);
  }

  function shutdown() {
    axios.get("/shutdown");
  }

  async function getLogo() {
    let logo = false;
    try {
      await axios.get("/logo");
      logo = "/logo";
    } finally {
      return logo;
    }
  }

  function toggleMenu() {
    store.dispatch({ type: TOGGLE_MENU });
  }

  function unlockConfig() {
    store.dispatch({ type: CONFIG_UNLOCK });
  }

  function saveConfig() {
    if (store.getState().config.hasChanged) {
      if (window.confirm("Are you sure you want to save these changes?")) {
        const newConfig = store.getState().config;
        delete newConfig.loaded;
        delete newConfig.locked;
        delete newConfig.hasChanged;
        console.log(newConfig);
        socket.emit("settings", newConfig);
        store.dispatch({ type: CONFIG_LOCK });
        reboot();
      }
    } else {
      store.dispatch({ type: CONFIG_LOCK });
    }
  }

  function changeConfig(event) {
    const address = event.target.name;
    let value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (event.target.type === "number") {
      value = Number(event.target.value);
    } else {
      value = event.target.value;
    }
    console.log({ address, value });

    store.dispatch({ type: CONFIG_CHANGE, payload: { address, value } });
  }

  loadConfig();
  loadStatic();

  return {
    forceInput,
    forceOutput,
    tableManual,
    getLog,
    getUniqueLog,
    reboot,
    shutdown,
    getLogo,
    toggleMenu,
    unlockConfig,
    saveConfig,
    changeConfig
  };
}

export default api;
