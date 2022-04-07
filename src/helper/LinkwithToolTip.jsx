import React, { Component } from "react";

import withToolTip from "./withToolTip";
import { Link } from "react-router-dom";

function LinkwithToolTip({
  to,
  faClasses,
  tooltipLabel,
  showToolTip,
  className,
}) {
  return (
    <Link className={className} to={to}>
      <i className={faClasses}></i>

      {showToolTip && <span className="tooltip-text">{tooltipLabel}</span>}
    </Link>
  );
}

export default withToolTip(LinkwithToolTip);
