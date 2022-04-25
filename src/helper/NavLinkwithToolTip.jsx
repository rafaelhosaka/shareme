import React, { Component } from "react";

import withToolTip from "./withToolTip";
import { NavLink } from "react-router-dom";

function NavLinkwithToolTip({
  to,
  faClasses,
  tooltipLabel,
  showToolTip,
  className,
  ...props
}) {
  return (
    <NavLink className={className} to={to} {...props}>
      <i className={faClasses}></i>

      {showToolTip && <span className="tooltip-text">{tooltipLabel}</span>}
    </NavLink>
  );
}

export default withToolTip(NavLinkwithToolTip);
