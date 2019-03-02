import socketIOClient from "socket.io-client";
import axios from "axios";

import {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  TABLE_CELL_COLOR,
  SELFLEARNING_STATE,
  RECEIVE_IP,
  RECEIVE_TIME,
  TOGGLE_MENU,
  OPEN_MENU,
  CLOSE_MENU,
  CONFIG_UNLOCK,
  CONFIG_LOCK,
  CONFIG_CHANGE,
  RECEIVE_CONFIG,
  RECEIVE_STATIC,
  TABLE_FOUND_STATE,
  RECEIVE_CONFIG_LIST,
  RECEIVE_LOG_LIST
} from "./actions/types";

function api(store) {
  const socket = socketIOClient();

  const messageTypes = {
    input: INPUT_PORT_STATE,
    output: OUTPUT_PORT_STATE,
    table: TABLE_CELL_STATE,
    tableColor: TABLE_CELL_COLOR,
    entry: SERIAL_COM_STATE,
    selfLearning: SELFLEARNING_STATE,
    ip: RECEIVE_IP,
    time: RECEIVE_TIME,
    notfound: TABLE_FOUND_STATE
  };

  for (let message in messageTypes) {
    socket.on(message, payload => {
      store.dispatch({ type: messageTypes[message], payload });
    });
  }

  socket.on("clearserial", () => {
    store.getState().internal.coms.forEach((com, index) =>
      store.dispatch({
        type: SERIAL_COM_STATE,
        payload: { entry: "", entryTime: new Date().getTime(), index }
      })
    );
  });

  function loadConfig(name) {
    if (name) {
      socket.emit("loadConfig", name, config => {
        store.dispatch({ type: RECEIVE_CONFIG, payload: JSON.parse(config) });
      });
    } else {
      axios
        .get("/config")
        .then(result => {
          console.log("Got config");
          store.dispatch({ type: RECEIVE_CONFIG, payload: result.data });
        })
        .catch(err => console.log("/config", err));
    }
  }

  function loadStatic() {
    axios.get("/static").then(result => {
      console.log("Got static");
      store.dispatch({ type: RECEIVE_STATIC, payload: result.data });
      document.title = result.data.name;
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

  function openMenu() {
    store.dispatch({ type: OPEN_MENU });
  }

  function closeMenu() {
    store.dispatch({ type: CLOSE_MENU });
  }

  function unlockConfig() {
    store.dispatch({ type: CONFIG_UNLOCK });
  }

  function saveConfig(name) {
    const newConfig = JSON.parse(JSON.stringify(store.getState().config));
    delete newConfig.loaded;
    delete newConfig.locked;
    delete newConfig.hasChanged;

    if (name) {
      configExists(name).then(result => {
        if (
          !result ||
          window.confirm("File already exists, do you want to overwrite?")
        ) {
          socket.emit("saveConfig", { name: name, config: newConfig });
        }
      });
      return;
    }

    if (store.getState().config.hasChanged) {
      if (window.confirm("Are you sure you want to save these changes?")) {
        socket.emit("settings", newConfig);
        store.dispatch({ type: CONFIG_LOCK });
        reboot();
      } else {
        window.location.reload();
      }
    } else {
      store.dispatch({ type: CONFIG_LOCK });
    }
  }

  function changeConfig(address, value, options) {
    if (options && options.numeric) {
      value = Number(value);
    }
    store.dispatch({ type: CONFIG_CHANGE, payload: { address, value } });
  }

  function getConfigList() {
    socket.emit("getConfigList", null, list => {
      store.dispatch({ type: RECEIVE_CONFIG_LIST, payload: list });
    });
  }

  function deleteConfig(name) {
    if (window.confirm("Do you really want to delete " + name + "?")) {
      socket.emit("deleteConfig", name);
      getConfigList();
    }
  }

  function downloadConfig(name) {
    window.location.href = "/downloadConfig?file=" + name;
  }

  function deleteGeneralSL(key) {
    socket.emit("deleteGeneralSL", key);
  }

  function deleteIndividualSL(key) {
    socket.emit("deleteIndividualSL", key);
  }

  function resetIndividualSL() {
    socket.emit("resetIndividualSL");
  }

  function getLogList() {
    socket.emit("getLogList", null, list => {
      store.dispatch({ type: RECEIVE_LOG_LIST, payload: list });
    });
  }

  function uploadLog(name, index) {
    socket.emit("uploadLog", { name, index }, msg => window.alert(msg));
  }

  function downloadLog(name) {
    window.location.href = "/downloadLog?file=" + name;
  }

  function downloadAllLogs() {
    window.location.href =
      "/downloadLog?multiFile=" + store.getState().misc.logList;
  }

  function deleteAllLogs() {
    const fileList = store.getState().misc.logList;
    for (let i = 0; i < fileList.length; i++) {
      socket.emit("deleteLog", fileList[i]);
    }
    getLogList();
  }

  function deleteLog(name) {
    socket.emit("deleteLog", name);
    getLogList();
  }

  function configExists(name) {
    return new Promise(resolve => {
      socket.emit("configExists", name, ({ result }) => resolve(result));
    });
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
    openMenu,
    closeMenu,
    unlockConfig,
    saveConfig,
    changeConfig,
    loadConfig,
    getConfigList,
    deleteConfig,
    downloadConfig,
    deleteGeneralSL,
    deleteIndividualSL,
    getLogList,
    uploadLog,
    deleteLog,
    downloadLog,
    downloadAllLogs,
    deleteAllLogs,
    configExists,
    resetIndividualSL
  };
}

export default api;
