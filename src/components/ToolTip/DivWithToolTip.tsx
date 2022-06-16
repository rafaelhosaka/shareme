import withToolTip from "./withToolTip";

interface DivWithToolTipProps {
  children: JSX.Element;
  tooltipLabel: string;
  className: string;
  showToolTip: boolean;
}

function DivWithToolTip({
  children,
  tooltipLabel,
  className,
  showToolTip,
}: DivWithToolTipProps) {
  return (
    <div className={className}>
      {children}
      {showToolTip && <span className={"tooltip-text"}>{tooltipLabel}</span>}
    </div>
  );
}

export default withToolTip(DivWithToolTip);
