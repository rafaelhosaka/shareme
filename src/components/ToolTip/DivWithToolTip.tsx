import withToolTip from "./withToolTip";
import { useEffect } from "react";

interface DivWithToolTipProps {
  children: JSX.Element;
  tooltipLabel: string;
  className: string;
  showToolTip: boolean;
  initializeToolTipText: (text: string) => void;
}

function DivWithToolTip({
  children,
  tooltipLabel,
  className,
  initializeToolTipText,
}: DivWithToolTipProps) {
  useEffect(() => {
    initializeToolTipText(tooltipLabel);
  }, []);
  return <div className={className}>{children}</div>;
}

export default withToolTip(DivWithToolTip);
