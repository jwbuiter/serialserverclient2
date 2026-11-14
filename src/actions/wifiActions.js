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

// ipConfig: null keeps a saved network's IP settings (DHCP for new networks).
export const connectWifi =
  (ssid, password, hidden = false, security = "", ipConfig = null) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiConnect", { ssid, password, hidden, security, ipConfig });

// target: "wifi" (the current Wi-Fi network) or "ethernet".
export const setIpConfig =
  (target, ipConfig) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiSetIp", { target, ipConfig });

export const forgetWifi =
  (name) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiForget", name);

// names: all saved networks (profile names), most preferred first.
export const setNetworkOrder =
  (names) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiOrder", names);

export const setWifiHotspot =
  (enable) =>
  (dispatch, getState, { emit }) =>
    call(emit, "wifiHotspot", enable);
