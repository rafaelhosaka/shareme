import React, { useState } from "react";

export default function withToolTip(Component) {
  function ComponentWithToolTip(props) {
    const [showToolTip, setShowToolTip] = useState(false);

    const mouseOut = () => {
      setShowToolTip(false);
    };
    const mouseOver = () => {
      setShowToolTip(true);
    };

    return (
      <div
        className="tooltip-container"
        onMouseOver={() => mouseOver()}
        onMouseOut={() => mouseOut()}
      >
        <Component {...props} showToolTip={showToolTip} />
      </div>
    );
  }
  return ComponentWithToolTip;
}
