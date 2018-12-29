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

//const APIendPoint = "http://" + window.location.hostname + ":80";
const APIendPoint = "http://192.168.1.67:80";
console.log(APIendPoint);

function api(store) {
  const socket = socketIOClient(APIendPoint);

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

  axios
    .get(APIendPoint + "/config")
    .then(result => {
      console.log("Got config");
      store.dispatch({ type: RECEIVE_CONFIG, payload: result.data });
    })
    .catch(err => console.log(APIendPoint + "/config", err));

  axios.get(APIendPoint + "/static").then(result => {
    console.log("Got static");
    store.dispatch({ type: RECEIVE_STATIC, payload: result.data });
  });

  function forceInput(index) {
    socket.emit("forceInput", index);
  }

  function forceOutput(index) {
    socket.emit("forceOutput", index);
  }

  function tableManual(index, value) {
    socket.emit("manual", { index, value });
  }

  function getLog() {
    return axios.get(APIendPoint + "/comlog");
  }

  function getUniqueLog() {
    return axios.get(APIendPoint + "/comlogu");
  }

  function reboot() {
    axios.get(APIendPoint + "/restart");
  }

  function shutdown() {
    axios.get(APIendPoint + "/shutdown");
  }

  async function getLogo() {
    let logo = false;
    try {
      await axios.get(APIendPoint + "/logo");
      logo = APIendPoint + "/logo";
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
        //save config
        store.dispatch({ type: CONFIG_LOCK });
        //reload page after some seconds
      }
    } else {
      store.dispatch({ type: CONFIG_LOCK });
    }
  }

  function changeConfig(changes) {}

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
