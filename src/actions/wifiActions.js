// Each action returns a promise resolving to the server's reply:
// { ok: true, ...result } or { ok: false, error }.
const call = (emit, type, payload) => new Promise((resolve) => emit(type, payload, resolve));

export const getWifiStatus =
  () =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiStatus", null);

export const scanWifi =
  (rescan = true) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiScan", { rescan });

export const connectWifi =
  (ssid, password, hidden = false) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiConnect", { ssid, password, hidden });

export const forgetWifi =
  (name) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiForget", name);

export const setWifiHotspot =
  (enable) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiHotspot", enable);
