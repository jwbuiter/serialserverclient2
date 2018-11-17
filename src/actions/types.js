function stringMapFromArray(array) {
  const result = {};
  array.forEach(elem => {
    result[elem] = elem;
  });
  return result;
}

const actionTypes = [
  "RECEIVE_IP",
  "RECEIVE_CONFIG",
  "RECEIVE_STATIC",
  "INPUT_PORT_STATE",
  "OUTPUT_PORT_STATE",
  "SERIAL_COM_STATE",
  "TABLE_CELL_STATE"
];

module.exports = stringMapFromArray(actionTypes);
