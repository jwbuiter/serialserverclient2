import React from "react";

// Form for DHCP / static IPv4 settings. The form value uses a subnet mask and
// a comma separated DNS list; toForm/fromForm convert from/to what the server
// uses ({ method, address, prefix, gateway, dns: [] }).

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

function prefixToMask(prefix) {
  const bits = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return [24, 16, 8, 0].map((shift) => (bits >>> shift) & 255).join(".");
}

// Accepts "255.255.255.0", "24" or "/24". Returns null when invalid.
function maskToPrefix(mask) {
  const value = String(mask || "").trim();
  const short = value.match(/^\/?(\d{1,2})$/);
  if (short) {
    const prefix = Number(short[1]);
    return prefix >= 1 && prefix <= 32 ? prefix : null;
  }
  if (!IPV4.test(value)) return null;
  const bits = value.split(".").reduce((acc, part) => ((acc << 8) | Number(part)) >>> 0, 0);
  const inverted = ~bits >>> 0;
  if ((inverted & (inverted + 1)) !== 0) return null; // not contiguous ones
  const prefix = 32 - Math.log2(inverted + 1);
  return prefix >= 1 ? prefix : null;
}

export const emptyForm = { method: "auto", address: "", netmask: "", gateway: "", dns: "", prefilled: false };

function fields(config) {
  return {
    address: config.address,
    netmask: prefixToMask(config.prefix),
    gateway: config.gateway,
    dns: config.dns.join(", "),
  };
}

// ipConfig: the saved settings. lease: what the interface currently has (from
// DHCP); used to prefill the static fields when the saved settings are DHCP.
export function toForm(ipConfig, lease) {
  if (ipConfig && ipConfig.method === "manual") {
    return { ...emptyForm, method: "manual", ...fields(ipConfig) };
  }
  if (lease) return { ...emptyForm, ...fields(lease), prefilled: true };
  return { ...emptyForm };
}

export function fromForm(form) {
  if (form.method !== "manual") return { method: "auto" };
  return {
    method: "manual",
    address: form.address.trim(),
    prefix: maskToPrefix(form.netmask),
    gateway: form.gateway.trim(),
    dns: form.dns
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s),
  };
}

// Returns an error message, or "" when the form is valid.
export function validateForm(form) {
  if (form.method !== "manual") return "";
  if (!IPV4.test(form.address.trim())) return "Enter a valid IP address.";
  if (maskToPrefix(form.netmask) === null) return "Enter a valid subnet mask, e.g. 255.255.255.0.";
  if (form.gateway.trim() && !IPV4.test(form.gateway.trim())) return "Enter a valid gateway.";
  const badDns = fromForm(form).dns.find((server) => !IPV4.test(server));
  if (badDns) return `"${badDns}" is not a valid DNS server.`;
  return "";
}

export default function IpSettings({ value, onChange, name }) {
  const set = (field) => (e) => onChange({ ...value, [field]: e.target.value });
  const error = validateForm(value);

  return (
    <div className="wifi--ipSettings">
      <div className="wifi--ipMethod">
        <label>
          <input type="radio" name={name} checked={value.method !== "manual"} onChange={() => onChange({ ...value, method: "auto" })} />
          Automatic (DHCP)
        </label>
        <label>
          <input type="radio" name={name} checked={value.method === "manual"} onChange={() => onChange({ ...value, method: "manual" })} />
          Static
        </label>
      </div>
      {value.method === "manual" && value.prefilled && (
        <div className="wifi--ipNote">
          Filled in with the address this connection has now.
        </div>
      )}
      {value.method === "manual" && (
        <div className="wifi--ipGrid">
          <label>
            IP address
            <input type="text" inputMode="decimal" value={value.address} onChange={set("address")} />
          </label>
          <label>
            Subnet mask
            <input type="text" inputMode="decimal" placeholder="e.g. 255.255.255.0" value={value.netmask} onChange={set("netmask")} />
          </label>
          <label>
            Gateway (optional)
            <input type="text" inputMode="decimal" placeholder="usually the router" value={value.gateway} onChange={set("gateway")} />
          </label>
          <label>
            DNS servers (optional)
            <input type="text" placeholder="comma separated" value={value.dns} onChange={set("dns")} />
          </label>
        </div>
      )}
      {value.method === "manual" && error && <div className="wifi--ipError">{error}</div>}
    </div>
  );
}
