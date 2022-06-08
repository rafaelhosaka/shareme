import withToolTip from "../../helper/withToolTip";
import { NavLink, To } from "react-router-dom";
import { useState } from "react";
import css from "./NavLinkWithToolTip.module.scss";

interface NavLinkWithToolTipProps {
  to: To;
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
  const [active, setActive] = useState(false);

  const handleActive = (isActive: boolean) => {
    setActive(isActive);
    return isActive ? `${activeClass} ${className}` : className;
  };

  return (
    <div className={css["tooltip-container"]}>
      <NavLink
        className={({ isActive }) => handleActive(isActive)}
        to={to}
        {...props}
      >
        <i className={active ? `${css.active} ${faClasses}` : faClasses}></i>

        {showToolTip && (
          <span className={css["tooltip-text"]}>{tooltipLabel}</span>
        )}
      </NavLink>
    </div>
  );
}

export default withToolTip(NavLinkWithToolTip);
