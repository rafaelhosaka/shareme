import withToolTip from "./withToolTip";
import { NavLink, To } from "react-router-dom";

interface NavLinkwithToolTipProps {
  to: To;
  faClasses: string;
  tooltipLabel: string;
  showToolTip: boolean;
  className: string;
  [x: string]: any;
}

function NavLinkwithToolTip({
  to,
  faClasses,
  tooltipLabel,
  showToolTip,
  className,
  ...props
}: NavLinkwithToolTipProps) {
  return (
    <NavLink className={className} to={to} {...props}>
      <i className={faClasses}></i>

      {showToolTip && <span className="tooltip-text">{tooltipLabel}</span>}
    </NavLink>
  );
}

export default withToolTip(NavLinkwithToolTip);
