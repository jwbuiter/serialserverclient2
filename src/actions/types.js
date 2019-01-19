function stringMapFromArray(array) {
  const result = {};
  array.forEach(elem => {
    result[elem] = elem;
  });
  return result;
}

const actionTypes = [
  "RECEIVE_TIME",
  "RECEIVE_IP",
  "TOGGLE_MENU",
  "RECEIVE_CONFIG",
  "RECEIVE_STATIC",
  "INPUT_PORT_STATE",
  "OUTPUT_PORT_STATE",
  "SERIAL_COM_STATE",
  "TABLE_CELL_STATE",
  "SELFLEARNING_STATE",
  "CONFIG_UNLOCK",
  "CONFIG_LOCK",
  "CONFIG_CHANGE",
  "TABLE_FOUND_STATE",
  "SERIAL_CLEAR"
];

module.exports = stringMapFromArray(actionTypes);
