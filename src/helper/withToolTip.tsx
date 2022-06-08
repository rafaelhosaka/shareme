import { ComponentType, useState } from "react";

export default function withToolTip<T>(Component: ComponentType<T>) {
  function ComponentWithToolTip(props: any) {
    const [showToolTip, setShowToolTip] = useState(false);

    const mouseOut = () => {
      setShowToolTip(false);
    };
    const mouseOver = () => {
      setShowToolTip(true);
    };

    return (
      <div onMouseOver={() => mouseOver()} onMouseOut={() => mouseOut()}>
        <Component {...props} showToolTip={showToolTip} />
      </div>
    );
  }
  return ComponentWithToolTip;
}
