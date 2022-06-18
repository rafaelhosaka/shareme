import withToolTip from "./withToolTip";
import { NavLink, useLocation } from "react-router-dom";
import _ from "lodash";
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
  activeURLs?: string[];
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
  activeURLs,
  ...props
}: NavLinkWithToolTipProps) {
  const { pathname: currentURL } = useLocation();
  const isActive = () => {
    if (activeURLs) {
      return activeURLs?.includes(currentURL);
    } else {
      return to === currentURL;
    }
  };

  useEffect(() => {
    initializeToolTipText(tooltipLabel);
  }, []);

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
