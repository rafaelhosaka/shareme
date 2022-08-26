import { ComponentType, useRef, useState } from "react";

export default function withToolTip<T>(Component: ComponentType<T>) {
  function ComponentWithToolTip(props: any) {
    const [showToolTip, setShowToolTip] = useState(false);
    const [toolTipText, setToolTipText] = useState("");
    const ref = useRef<HTMLSpanElement>(null);

    const mouseOut = () => {
      setShowToolTip(false);
    };
    const mouseOver = () => {
      setShowToolTip(true);
      if (ref.current) {
        let offset = ref.current.getBoundingClientRect();
        if (offset.x + offset.width > window.innerWidth) {
          ref.current.style.left = -offset.width + 70 + "px";
        }
      }
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
        {showToolTip && (
          <span ref={ref} className={"tooltip-text"}>
            {toolTipText}
          </span>
        )}
      </div>
    );
  }
  return ComponentWithToolTip;
}
