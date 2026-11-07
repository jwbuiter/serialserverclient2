import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import { getWifiStatus, scanWifi, connectWifi, forgetWifi, setWifiHotspot } from "../../actions/wifiActions";
import "../../styles/wifi.scss";

const CONNECT_TIMEOUT = 90 * 1000;

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
      this.setState({ selected: null, password: "", message: "", error: "" });
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

    const scanReply = await this.props.scanWifi(rescan);
    if (scanReply.ok) {
      this.safeSetState({ networks: scanReply.networks, cached: scanReply.cached, scanning: false });
    } else {
      this.safeSetState({ scanning: false, error: scanReply.error });
    }
  };

  select = (ssid) => {
    if (this.state.busy) return;
    this.setState({ selected: this.state.selected === ssid ? null : ssid, password: "", error: "" });
  };

  doConnect = async (ssid, password, hidden) => {
    const { status } = this.state;
    const wasWireless = status && status.connected;
    const hostname = status ? status.hostname : "";

    this.setState({
      busy: true,
      error: "",
      message: wasWireless
        ? `Connecting to "${ssid}"... If your device is connected through this unit's Wi-Fi, this page will lose its ` +
          `connection. Connect your device to "${ssid}" and open http://${hostname}.local`
        : `Connecting to "${ssid}"...`,
    });

    const reply = await withTimeout(this.props.connectWifi(ssid, password, hidden), CONNECT_TIMEOUT);

    if (reply.ok) {
      this.safeSetState({
        busy: false,
        selected: null,
        password: "",
        otherSsid: "",
        otherPassword: "",
        otherOpen: false,
        message: `Connected to "${ssid}"${reply.status.ip ? ` with address ${reply.status.ip}` : ""}.`,
      });
      this.refresh(false);
    } else if (reply.timeout) {
      this.safeSetState({
        busy: false,
        message:
          `No answer from the unit. If the connection to "${ssid}" worked, open http://${hostname}.local from a ` +
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

  renderStatus() {
    const { status } = this.state;
    if (!status) return <p className="wifi--status">Loading...</p>;
    if (!status.available) return <p className="wifi--status">No Wi-Fi adapter found on this unit.</p>;

    let text;
    if (status.hotspot) text = `Hotspot "${status.hotspotSSID}" active${status.ip ? ` (${status.ip})` : ""}`;
    else if (status.connected) text = `Connected to "${status.connection}"${status.ip ? ` (${status.ip})` : ""}`;
    else text = `Not connected (${status.state})`;

    return (
      <div className="wifi--status">
        <div>
          <b>Status:</b> {text}
        </div>
        <div>
          <b>Address:</b> http://{status.hostname}.local
        </div>
      </div>
    );
  }

  renderNetwork(network) {
    const { selected, password, busy, saved } = this.state;
    const isSelected = selected === network.ssid;
    const savedProfile = saved.find((s) => s.ssid === network.ssid);

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
              this.doConnect(network.ssid, password, false);
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
              disabled={busy || (!!network.security && !network.saved && password.length < 8)}
            />
            {savedProfile && (
              <input type="button" value="Forget" disabled={busy} onClick={() => this.doForget(savedProfile.name)} />
            )}
          </form>
        )}
      </li>
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
        contentLabel="Wi-Fi Modal"
      >
        <h2>Wi-Fi</h2>
        {this.renderStatus()}

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
            {message && <p className="wifi--message">{message}</p>}
            {error && <p className="wifi--error">{error}</p>}

            <ul className="wifi--list">
              {networks.map((network) => this.renderNetwork(network))}
              {!scanning && networks.length === 0 && <li className="wifi--empty">No networks found.</li>}
            </ul>

            <div className="wifi--other">
              <span className="wifi--otherToggle" onClick={() => this.setState({ otherOpen: !otherOpen })}>
                {otherOpen ? "▾" : "▸"} Hidden network
              </span>
              {otherOpen && (
                <form
                  className="wifi--connectForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.doConnect(otherSsid.trim(), otherPassword, true);
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
                    disabled={busy || !otherSsid.trim() || (otherPassword.length > 0 && otherPassword.length < 8)}
                  />
                </form>
              )}
            </div>
          </>
        )}
      </Modal>
    );
  }
}

export default connect(null, { getWifiStatus, scanWifi, connectWifi, forgetWifi, setWifiHotspot })(WifiModal);
