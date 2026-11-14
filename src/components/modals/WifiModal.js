import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import {
  getWifiStatus,
  scanWifi,
  connectWifi,
  forgetWifi,
  setWifiHotspot,
  setIpConfig,
  setNetworkOrder,
} from "../../actions/wifiActions";
import IpSettings, { emptyForm, toForm, fromForm, validateForm } from "./IpSettings";
import "../../styles/wifi.scss";

const CONNECT_TIMEOUT = 90 * 1000;
const SET_IP_TIMEOUT = 20 * 1000;

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve({ ok: false, timeout: true }), ms))]);

function SignalBars({ signal }) {
  const level = signal >= 75 ? 4 : signal >= 50 ? 3 : signal >= 25 ? 2 : 1;
  return (
    <span className="wifi--signal" title={`${signal}%`}>
      {[1, 2, 3, 4].map((bar) => (
        <span key={bar} className={bar <= level ? "on" : ""} style={{ height: `${bar * 25}%` }} />
      ))}
    </span>
  );
}

// " (192.168.1.20, DHCP)"
function ipSuffix(iface) {
  const parts = [];
  if (iface.ip) parts.push(iface.ip);
  if (iface.ipConfig) parts.push(iface.ipConfig.method === "manual" ? "static" : "DHCP");
  return parts.length ? ` (${parts.join(", ")})` : "";
}

const LABELS = { wifi: "Wi-Fi", ethernet: "Ethernet" };

class WifiModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      saved: [],
      networks: [],
      cached: false,
      scanning: false,
      busy: false,
      selected: null,
      password: "",
      otherOpen: false,
      otherSsid: "",
      otherPassword: "",
      // IP settings in the connect forms; only sent when opened.
      connectIpOpen: false,
      connectIp: { ...emptyForm },
      // IP settings editor of the current Wi-Fi network / Ethernet ("wifi", "ethernet" or null).
      ipEditor: null,
      ipForm: { ...emptyForm },
      message: "",
      error: "",
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.isOpen) this.refresh();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ selected: null, password: "", ipEditor: null, connectIpOpen: false, message: "", error: "" });
      this.refresh();
    }
  }

  safeSetState(state) {
    if (this.mounted) this.setState(state);
  }

  refresh = async (rescan = true) => {
    this.safeSetState({ scanning: true, error: "" });
    const statusReply = await this.props.getWifiStatus();
    if (!statusReply.ok) {
      this.safeSetState({ scanning: false, error: statusReply.error });
      return;
    }
    this.safeSetState({ status: statusReply.status, saved: statusReply.saved });
    if (!statusReply.status.available) {
      this.safeSetState({ scanning: false });
      return;
    }

    const scanReply = await this.props.scanWifi(rescan);
    if (scanReply.ok) {
      this.safeSetState({ networks: scanReply.networks, cached: scanReply.cached, scanning: false });
    } else {
      this.safeSetState({ scanning: false, error: scanReply.error });
    }
  };

  select = (ssid) => {
    if (this.state.busy) return;
    if (this.state.selected === ssid) {
      this.setState({ selected: null });
      return;
    }
    // Start from the saved network's own IP settings, if it has any. For the
    // network the unit is on now, the current address prefills the static fields.
    const { saved, status, networks } = this.state;
    const savedProfile = saved.find((s) => s.ssid === ssid);
    const network = networks.find((n) => n.ssid === ssid);
    const lease = network && network.inUse && status ? status.lease : null;
    this.setState({
      selected: ssid,
      password: "",
      error: "",
      otherOpen: false,
      connectIpOpen: false,
      connectIp: toForm(savedProfile && savedProfile.ipConfig, lease),
    });
  };

  toggleOther = () => {
    this.setState({
      otherOpen: !this.state.otherOpen,
      selected: null,
      connectIpOpen: false,
      connectIp: { ...emptyForm },
    });
  };

  doConnect = async (ssid, password, hidden, security) => {
    const { status, connectIpOpen, connectIp } = this.state;
    const wasWireless = status && status.connected;
    const hostname = status ? status.hostname : "";
    const ipConfig = connectIpOpen ? fromForm(connectIp) : null;
    const newAddress =
      ipConfig && ipConfig.method === "manual" ? `http://${ipConfig.address}` : `http://${hostname}.local`;

    this.setState({
      busy: true,
      error: "",
      message: wasWireless
        ? `Connecting to "${ssid}"... If your device is connected through this unit's Wi-Fi, this page will lose its ` +
          `connection. Connect your device to "${ssid}" and open ${newAddress}`
        : `Connecting to "${ssid}"...`,
    });

    const reply = await withTimeout(
      this.props.connectWifi(ssid, password, hidden, security, ipConfig),
      CONNECT_TIMEOUT
    );

    if (reply.ok) {
      this.safeSetState({
        busy: false,
        selected: null,
        password: "",
        otherSsid: "",
        otherPassword: "",
        otherOpen: false,
        connectIpOpen: false,
        message: `Connected to "${ssid}"${reply.status.ip ? ` with address ${reply.status.ip}` : ""}.`,
      });
      this.refresh(false);
    } else if (reply.timeout) {
      this.safeSetState({
        busy: false,
        message:
          `No answer from the unit. If the connection to "${ssid}" worked, open ${newAddress} from a ` +
          `device on that network. If it failed, the unit's hotspot "${status ? status.hotspotSSID : ""}" will come back within a minute.`,
      });
    } else {
      this.safeSetState({ busy: false, message: "", error: `Could not connect to "${ssid}": ${reply.error}` });
      this.refresh(false);
    }
  };

  doForget = async (name) => {
    if (!window.confirm(`Forget the saved network "${name}"?`)) return;
    this.setState({ busy: true, error: "" });
    const reply = await this.props.forgetWifi(name);
    this.safeSetState({ busy: false, selected: null, error: reply.ok ? "" : reply.error });
    this.refresh(false);
  };

  // Moves a saved network up (delta -1) or down (delta 1) in the preference order.
  moveSaved = async (index, delta) => {
    const saved = this.state.saved.slice();
    const [item] = saved.splice(index, 1);
    saved.splice(index + delta, 0, item);
    this.setState({ saved, busy: true, error: "" });

    const reply = await this.props.setNetworkOrder(saved.map((s) => s.name));
    this.safeSetState({ busy: false, error: reply.ok ? "" : `Could not change the order: ${reply.error}` });
    if (!reply.ok) this.refresh(false);
  };

  toggleHotspot = async () => {
    const enable = !this.state.status.hotspot;
    if (
      enable &&
      !window.confirm(
        `Start the hotspot "${this.state.status.hotspotSSID}"? The unit will disconnect from its current Wi-Fi network.`
      )
    )
      return;
    this.setState({ busy: true, error: "", message: enable ? "Starting hotspot..." : "Stopping hotspot..." });
    const reply = await this.props.setWifiHotspot(enable);
    this.safeSetState({ busy: false, message: "", error: reply.ok ? "" : reply.error });
    this.refresh(false);
  };

  interfaceStatus(target) {
    const { status } = this.state;
    return target === "wifi" ? status : status.ethernet;
  }

  toggleIpEditor = (target) => {
    if (this.state.ipEditor === target) {
      this.setState({ ipEditor: null });
      return;
    }
    const iface = this.interfaceStatus(target);
    this.setState({ ipEditor: target, ipForm: toForm(iface.ipConfig, iface.lease), error: "" });
  };

  saveIp = async () => {
    const { ipEditor: target, ipForm, status } = this.state;
    const formError = validateForm(ipForm);
    if (formError) {
      this.setState({ error: formError });
      return;
    }

    const iface = this.interfaceStatus(target);
    const label = LABELS[target];
    const config = fromForm(ipForm);
    const newAddress = config.method === "manual" ? `http://${config.address}` : `http://${status.hostname}.local`;

    if (
      iface.connected &&
      !window.confirm(
        `Apply the new ${label} IP settings now? If your device is connected through ${label}, ` +
          `this page will lose its connection. The unit will then be at ${newAddress}`
      )
    )
      return;

    this.setState({ busy: true, error: "", message: "" });
    const reply = await withTimeout(this.props.setIpConfig(target, config), SET_IP_TIMEOUT);

    if (reply.ok) {
      this.safeSetState({
        busy: false,
        ipEditor: null,
        message: reply.applied
          ? `${label} IP settings saved and applied.`
          : `${label} IP settings saved. They will be used the next time ${label} connects.`,
      });
      // Give NetworkManager a moment to apply the new address.
      setTimeout(() => this.mounted && this.refresh(false), 3000);
    } else if (reply.timeout) {
      this.safeSetState({
        busy: false,
        message: `No answer from the unit. If the settings were applied, open ${newAddress}`,
      });
    } else {
      this.safeSetState({ busy: false, error: `Could not save ${label} IP settings: ${reply.error}` });
    }
  };

  renderIpEditor(target) {
    const { ipEditor, ipForm, busy } = this.state;
    if (ipEditor !== target) return null;
    return (
      <form
        className="wifi--ipEditor"
        onSubmit={(e) => {
          e.preventDefault();
          this.saveIp();
        }}
      >
        <IpSettings name={`ip-${target}`} value={ipForm} onChange={(value) => this.setState({ ipForm: value })} />
        <div className="wifi--ipButtons">
          <input type="submit" value="Save" disabled={busy || !!validateForm(ipForm)} />
          <input type="button" value="Cancel" disabled={busy} onClick={() => this.setState({ ipEditor: null })} />
        </div>
      </form>
    );
  }

  renderStatus() {
    const { status, busy } = this.state;
    if (!status) return <p className="wifi--status">Loading...</p>;

    let wifiText;
    if (!status.available) wifiText = "No Wi-Fi adapter found";
    else if (status.hotspot) wifiText = `Hotspot "${status.hotspotSSID}" active${status.ip ? ` (${status.ip})` : ""}`;
    else if (status.connected) wifiText = `Connected to "${status.connection}"${ipSuffix(status)}`;
    else wifiText = `Not connected (${status.state})`;

    const ethernet = status.ethernet || { available: false };
    let ethernetText;
    if (!ethernet.available) ethernetText = "No Ethernet port found";
    else if (ethernet.connected) ethernetText = `Connected${ipSuffix(ethernet)}`;
    else if (ethernet.state === "unavailable")
      ethernetText = `No cable connected${ethernet.ipConfig && ethernet.ipConfig.method === "manual" ? " (static IP set)" : ""}`;
    else ethernetText = `Not connected (${ethernet.state})`;

    const canEditWifi = status.available && status.connected && !status.hotspot;

    return (
      <div className="wifi--status">
        <div className="wifi--statusRow">
          <span>
            <b>Wi-Fi:</b> {wifiText}
          </span>
          {canEditWifi && (
            <input type="button" value="IP settings" disabled={busy} onClick={() => this.toggleIpEditor("wifi")} />
          )}
        </div>
        {canEditWifi && this.renderIpEditor("wifi")}
        <div className="wifi--statusRow">
          <span>
            <b>Ethernet:</b> {ethernetText}
          </span>
          {ethernet.available && (
            <input type="button" value="IP settings" disabled={busy} onClick={() => this.toggleIpEditor("ethernet")} />
          )}
        </div>
        {ethernet.available && this.renderIpEditor("ethernet")}
        <div className="wifi--statusRow">
          <span>
            <b>Address:</b> http://{status.hostname}.local
          </span>
        </div>
      </div>
    );
  }

  // "▸ IP settings" toggle plus the settings, shown inside a connect form.
  renderConnectIp() {
    const { connectIpOpen, connectIp } = this.state;
    return (
      <>
        <span className="wifi--ipToggle" onClick={() => this.setState({ connectIpOpen: !connectIpOpen })}>
          {connectIpOpen ? "▾" : "▸"} IP settings
        </span>
        {connectIpOpen && (
          <IpSettings name="ip-connect" value={connectIp} onChange={(value) => this.setState({ connectIp: value })} />
        )}
      </>
    );
  }

  connectIpInvalid() {
    return this.state.connectIpOpen && !!validateForm(this.state.connectIp);
  }

  renderNetwork(network) {
    const { selected, password, busy } = this.state;
    const isSelected = selected === network.ssid;

    return (
      <li key={network.ssid} className={"wifi--network" + (isSelected ? " selected" : "")}>
        <div className="wifi--networkRow" onClick={() => this.select(network.ssid)}>
          <SignalBars signal={network.signal} />
          <span className="wifi--ssid">{network.ssid}</span>
          <span className="wifi--tags">
            {network.inUse && <span className="wifi--tag connected">connected</span>}
            {network.saved && !network.inUse && <span className="wifi--tag">saved</span>}
            {network.security ? network.security : "open"}
          </span>
        </div>
        {isSelected && (
          <form
            className="wifi--connectForm"
            onSubmit={(e) => {
              e.preventDefault();
              this.doConnect(network.ssid, password, false, network.security);
            }}
          >
            {network.security ? (
              <input
                type="password"
                placeholder={network.saved ? "Password (leave empty to use saved)" : "Password"}
                value={password}
                autoFocus
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            ) : (
              <span className="wifi--openNote">Open network, no password needed</span>
            )}
            <input
              type="submit"
              value={network.inUse ? "Reconnect" : "Connect"}
              disabled={
                busy ||
                (!!network.security && !network.saved && password.length < 8) ||
                this.connectIpInvalid()
              }
            />
            {this.renderConnectIp()}
          </form>
        )}
      </li>
    );
  }

  // Saved networks in preference order: the unit joins the highest one in range.
  renderSaved() {
    const { saved, networks, cached, status, busy } = this.state;
    if (saved.length === 0) return null;
    const inRange = new Set(networks.map((n) => n.ssid));

    return (
      <div className="wifi--saved">
        <h3>Saved networks</h3>
        <p className="wifi--note">When several are in range, the unit joins the highest one in this list.</p>
        <ul className="wifi--list">
          {saved.map((network, index) => (
            <li key={network.name} className="wifi--savedRow">
              <span className="wifi--order">{index + 1}.</span>
              <span className="wifi--ssid">{network.ssid}</span>
              <span className="wifi--tags">
                {status && status.connected && status.connection === network.name && (
                  <span className="wifi--tag connected">connected</span>
                )}
                {network.ipConfig && network.ipConfig.method === "manual" && (
                  <span className="wifi--tag">static IP</span>
                )}
                {!cached && !inRange.has(network.ssid) && "not in range"}
              </span>
              <input
                type="button"
                value="▲"
                title="Prefer this network"
                disabled={busy || index === 0}
                onClick={() => this.moveSaved(index, -1)}
              />
              <input
                type="button"
                value="▼"
                title="Prefer other networks"
                disabled={busy || index === saved.length - 1}
                onClick={() => this.moveSaved(index, 1)}
              />
              <input type="button" value="Forget" disabled={busy} onClick={() => this.doForget(network.name)} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { status, networks, cached, scanning, busy, otherOpen, otherSsid, otherPassword, message, error } =
      this.state;
    const available = status && status.available;

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        overlayClassName="modalOverlay"
        className="modalContent wifi"
        contentLabel="Network Modal"
      >
        <h2>Network</h2>
        {this.renderStatus()}

        {message && <p className="wifi--message">{message}</p>}
        {error && <p className="wifi--error">{error}</p>}

        {available && (
          <>
            <div className="wifi--toolbar">
              <input
                type="button"
                value={scanning ? "Scanning..." : "Scan"}
                disabled={scanning || busy}
                onClick={() => this.refresh(true)}
              />
              <input
                type="button"
                value={status.hotspot ? "Stop hotspot" : "Start hotspot"}
                disabled={busy}
                onClick={this.toggleHotspot}
              />
            </div>

            {cached && (
              <p className="wifi--note">
                The hotspot is active, so the unit can't scan. These networks were found just before it started.
              </p>
            )}

            <ul className="wifi--list">
              {networks.map((network) => this.renderNetwork(network))}
              {!scanning && networks.length === 0 && <li className="wifi--empty">No networks found.</li>}
            </ul>

            <div className="wifi--other">
              <span className="wifi--otherToggle" onClick={this.toggleOther}>
                {otherOpen ? "▾" : "▸"} Hidden network
              </span>
              {otherOpen && (
                <form
                  className="wifi--connectForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.doConnect(otherSsid.trim(), otherPassword, true, "");
                  }}
                >
                  <input
                    type="text"
                    placeholder="Network name (SSID)"
                    value={otherSsid}
                    onChange={(e) => this.setState({ otherSsid: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password (empty for open network)"
                    value={otherPassword}
                    onChange={(e) => this.setState({ otherPassword: e.target.value })}
                  />
                  <input
                    type="submit"
                    value="Connect"
                    disabled={
                      busy ||
                      !otherSsid.trim() ||
                      (otherPassword.length > 0 && otherPassword.length < 8) ||
                      this.connectIpInvalid()
                    }
                  />
                  {this.renderConnectIp()}
                </form>
              )}
            </div>

            {this.renderSaved()}
          </>
        )}
      </Modal>
    );
  }
}

export default connect(null, {
  getWifiStatus,
  scanWifi,
  connectWifi,
  forgetWifi,
  setWifiHotspot,
  setIpConfig,
  setNetworkOrder,
})(WifiModal);
