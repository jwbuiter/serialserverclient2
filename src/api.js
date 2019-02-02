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
  RECEIVE_STATIC,
  TABLE_FOUND_STATE,
  RECEIVE_CONFIG_LIST
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
        console.log(config);
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

  function unlockConfig() {
    store.dispatch({ type: CONFIG_UNLOCK });
  }

  function saveConfig(name) {
    const newConfig = JSON.parse(JSON.stringify(store.getState().config));
    delete newConfig.loaded;
    delete newConfig.locked;
    delete newConfig.hasChanged;

    if (name) {
      socket.emit("configExists", name, ({ result, name }) => {
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

  function changeConfig(event) {
    const address = event.target.name;
    let value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (
      event.target.type === "number" ||
      event.target.className === "numeric"
    ) {
      console.log("number");
      value = Number(event.target.value);
    } else {
      value = event.target.value;
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
    changeConfig,
    loadConfig,
    getConfigList,
    deleteConfig,
    downloadConfig,
    deleteGeneralSL,
    deleteIndividualSL
  };
}

export default api;
