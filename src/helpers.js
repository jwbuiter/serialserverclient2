import React from "react";

function get(object, address) {
  address = address.replace(/^\.+/, "");
  const parts = address.split(/[.[]/);

  if (parts.length === 1) {
    return object[parts[0]];
  } else if (address[0] === "[") {
    const index = address.match(/\[[0-9]+\]/)[0].slice(1, -1);
    const newAddress = address.slice(index.length + 2);
    return get(object[Number(index)], newAddress);
  } else {
    const newAddress = address.slice(parts[0].length);
    return get(object[parts[0]], newAddress);
  }
}

function set(object, address, newValue) {
  address = address.replace(/^\.+/, "");
  const parts = address.split(/[.[]/);

  if (parts.length === 1) {
    object[parts[0]] = newValue;
  } else if (address[0] === "[") {
    const index = address.match(/\[[0-9]+\]/)[0].slice(1, -1);
    const newAddress = address.slice(index.length + 2);
    set(object[Number(index)], newAddress, newValue);
  } else {
    const newAddress = address.slice(parts[0].length);
    set(object[parts[0]], newAddress, newValue);
  }
}

function makeForm(value, config, index, name = "") {
  if (typeof value.type === "undefined" || typeof value.type === "object") {
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return (
          index >= 0 && (
            <div name={name}>
              {Object.keys(value[0]).map(key =>
                makeForm(
                  value[0][key],
                  config,
                  index,
                  name + "[" + index + "]." + key
                )
              )}
            </div>
          )
        );
      }
    } else {
      return (
        <div key={name} name={name}>
          {Object.keys(value)
            .filter(key => {
              const { conditions } = value[key];
              if (!conditions) return true;

              return true;
            })
            .map(key =>
              makeForm(
                value[key],
                config,
                index,
                name + (name ? "." : "") + key
              )
            )}
        </div>
      );
    }
  } else {
    switch (value.type) {
      case "title": {
        return <h3 key={value.name}>{value.name}</h3>;
      }
      case "select": {
        return (
          <>
            {value.name}:
            <select name={name} value={get(config, name)}>
              {Object.entries(value.options).map((entry, index) => (
                <option key={index} value={entry[0]}>
                  {entry[1]}
                </option>
              ))}
            </select>
            <br />
          </>
        );
      }
      default: {
        return (
          <>
            {value.name}:
            <input
              type={value.type}
              name={name}
              min={value.min}
              max={value.max}
              step={value.step}
              checked={get(config, name)}
              value={get(config, name)}
            />
            <br />
          </>
        );
      }
    }
  }
}

const getColumnWidth = (rows, accessor) => {
  const maxWidth = 400;
  const minWidth = 50;
  const magicSpacing = 11;
  const cellLength = Math.max(
    ...rows.map(row => (`${row[accessor]}` || "").length)
  );
  return Math.max(minWidth, Math.min(maxWidth, cellLength * magicSpacing));
};

export { get, set, makeForm, getColumnWidth };
