import "./Spinner.css";

interface SpinnerProps {
  fragment: JSX.Element;
  className: string;
  show: boolean;
}

function Spinner({ fragment, className, show = true }: SpinnerProps) {
  return <>{show ? <div className={`loader ${className}`}></div> : fragment}</>;
}

export default Spinner;
