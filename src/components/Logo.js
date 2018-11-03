import React from "react";
import "../styles/logo.scss";

const Logo = props => {
  return (
    <div className="logo">
      <img className="center" src={props.image} />
    </div>
  );
};

export default Logo;
