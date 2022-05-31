import React from "react";
import "./Spinner.css";

function Spinner({ fragment, className, show = true }) {
  return <>{show ? <div className={`loader ${className}`}></div> : fragment}</>;
}

export default Spinner;
