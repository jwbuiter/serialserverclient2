import socketIOClient from "socket.io-client";
import axios from "axios";

import {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  SERIAL_COM_STATE,
  TABLE_CELL_STATE,
  RECEIVED_IP,
  RECEIVED_TIME
} from "./actions/types";

const APIendPoint = "http://127.0.0.1:5000";

function api(store) {
  const socket = socketIOClient(APIendPoint);

  const messageTypes = {
    input: INPUT_PORT_STATE,
    output: OUTPUT_PORT_STATE,
    table: TABLE_CELL_STATE,
    serial: SERIAL_COM_STATE,
    ip: RECEIVED_IP,
    time: RECEIVED_TIME
  };

  for (let message in messageTypes) {
    socket.on(message, payload =>
      store.dispatch({ type: messageTypes[message], payload })
    );
  }

  function forceInput(index) {
    socket.emit("forceInput", index);
  }

  function forceOutput(index) {
    socket.emit("forceOutput", index);
  }

  return { forceInput, forceOutput };
}

export default api;
