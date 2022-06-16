import withToolTip from "./withToolTip";
import { NavLink } from "react-router-dom";

interface NavLinkWithToolTipProps {
  children: JSX.Element;
  to: string;
  faClasses: string;
  tooltipLabel: string;
  showToolTip: boolean;
  className: string;
  activeClass?: string;
  [x: string]: any;
}

function NavLinkWithToolTip({
  children,
  to,
  tooltipLabel,
  showToolTip,
  className,
  activeClass,
  ...props
}: NavLinkWithToolTipProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive ? `${activeClass} ${className}` : className
      }
      to={to}
      {...props}
    >
      {children}

      {showToolTip && <span className={"tooltip-text"}>{tooltipLabel}</span>}
    </NavLink>
  );
}

export default withToolTip(NavLinkWithToolTip);
