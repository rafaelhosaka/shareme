import withToolTip from "./withToolTip";
import { useEffect } from "react";

interface DivWithToolTipProps {
  children: JSX.Element;
  tooltipLabel: string;
  className: string;
  showToolTip: boolean;
  initializeToolTipText: (text: string) => void;
  onClick: () => void;
}

function DivWithToolTip({
  children,
  tooltipLabel,
  className,
  initializeToolTipText,
  onClick,
}: DivWithToolTipProps) {
  useEffect(() => {
    initializeToolTipText(tooltipLabel);
  }, [tooltipLabel]);

  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}

export default withToolTip(DivWithToolTip);
