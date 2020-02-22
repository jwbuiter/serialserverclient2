import {
  INPUT_PORT_STATE,
  OUTPUT_PORT_STATE,
  TABLE_CELL_STATE,
  TABLE_CELL_COLOR,
  SERIAL_COM_STATE,
  SELFLEARNING_STATE,
  RECEIVE_IP,
  RECEIVE_TIME,
  TABLE_FOUND_STATE,
  SERIAL_CLEAR,
  SET_WARNING
} from "./types";

export default {
  input: INPUT_PORT_STATE,
  output: OUTPUT_PORT_STATE,
  table: TABLE_CELL_STATE,
  tableColor: TABLE_CELL_COLOR,
  entry: SERIAL_COM_STATE,
  selfLearning: SELFLEARNING_STATE,
  ip: RECEIVE_IP,
  time: RECEIVE_TIME,
  notfound: TABLE_FOUND_STATE,
  clearSerial: SERIAL_CLEAR,
  setWarning: SET_WARNING
};
