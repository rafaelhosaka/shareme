import withToolTip from "./withToolTip";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface NavLinkWithToolTipProps {
  children: JSX.Element;
  to: string;
  faClasses: string;
  tooltipLabel: string;
  showToolTip: boolean;
  initializeToolTipText: (text: string) => void;
  className: string;
  activeClass?: string;
  activeStartWith?: string;
  [x: string]: any;
}

function NavLinkWithToolTip({
  children,
  to,
  tooltipLabel,
  initializeToolTipText,
  showToolTip,
  className,
  activeClass,
  activeStartWith,
  ...props
}: NavLinkWithToolTipProps) {
  const { pathname: currentURL } = useLocation();
  const isActive = () => {
    if (activeStartWith) {
      return currentURL.startsWith(activeStartWith);
    } else {
      return to === currentURL;
    }
  };

  useEffect(() => {
    initializeToolTipText(tooltipLabel);
  }, [tooltipLabel]);

  return (
    <NavLink
      className={isActive() ? `${activeClass} ${className}` : className}
      to={to}
      {...props}
    >
      {children}
    </NavLink>
  );
}

export default withToolTip(NavLinkWithToolTip);
