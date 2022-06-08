import withToolTip from "../../helper/withToolTip";
import { NavLink } from "react-router-dom";

import css from "./NavLinkWithToolTip.module.scss";

interface NavLinkWithToolTipProps {
  to: string;
  faClasses: string;
  tooltipLabel: string;
  showToolTip: boolean;
  className: string;
  activeClass?: string;
  [x: string]: any;
}

function NavLinkWithToolTip({
  to,
  faClasses,
  tooltipLabel,
  showToolTip,
  className,
  activeClass,
  ...props
}: NavLinkWithToolTipProps) {
  return (
    <div className={css["tooltip-container"]}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${activeClass} ${className}` : className
        }
        to={to}
        {...props}
      >
        <i className={faClasses}></i>

        {showToolTip && (
          <span className={css["tooltip-text"]}>{tooltipLabel}</span>
        )}
      </NavLink>
    </div>
  );
}

export default withToolTip(NavLinkWithToolTip);
