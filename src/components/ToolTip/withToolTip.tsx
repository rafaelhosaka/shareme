import { ComponentType, useState } from "react";

export default function withToolTip<T>(Component: ComponentType<T>) {
  function ComponentWithToolTip(props: any) {
    const [showToolTip, setShowToolTip] = useState(false);
    const [toolTipText, setToolTipText] = useState("");

    const mouseOut = () => {
      setShowToolTip(false);
    };
    const mouseOver = () => {
      setShowToolTip(true);
    };
    const initializeToolTipText = (text: string) => {
      setToolTipText(text);
    };

    return (
      <div
        className="tooltip-container"
        onMouseOver={() => mouseOver()}
        onMouseOut={() => mouseOut()}
      >
        <Component
          {...props}
          initializeToolTipText={initializeToolTipText}
          showToolTip={showToolTip}
        />
        {showToolTip && <span className={"tooltip-text"}>{toolTipText}</span>}
      </div>
    );
  }
  return ComponentWithToolTip;
}
