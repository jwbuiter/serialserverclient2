import socketIOClient from "socket.io-client";
import axios from "axios";

import {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  RECEIVE_IP,
  RECEIVE_TIME,
  RECEIVE_CONFIG,
  RECEIVE_STATIC
} from "./actions/types";

const APIendPoint = "http://192.168.1.67";

function api(store) {
  const socket = socketIOClient(APIendPoint);

  const messageTypes = {
    input: INPUT_PORT_STATE,
    output: OUTPUT_PORT_STATE,
    table: TABLE_CELL_STATE,
    entry: SERIAL_COM_STATE,
    ip: RECEIVE_IP,
    time: RECEIVE_TIME
  };

  for (let message in messageTypes) {
    socket.on(message, payload =>
      store.dispatch({ type: messageTypes[message], payload })
    );
  }

  axios
    .get(APIendPoint + "/config")
    .then(result =>
      store.dispatch({ type: RECEIVE_CONFIG, payload: result.data })
    );

  axios
    .get(APIendPoint + "/static")
    .then(result =>
      store.dispatch({ type: RECEIVE_STATIC, payload: result.data })
    );

  function forceInput(index) {
    socket.emit("forceInput", index);
  }

  function forceOutput(index) {
    socket.emit("forceOutput", index);
  }

  return { forceInput, forceOutput };
}

export default api;
