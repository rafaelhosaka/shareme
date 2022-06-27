import css from "./Spinner.module.scss";
import { ReactElement } from "react";

interface SpinnerProps {
  sizeClass: string;
  show: boolean;
  children: ReactElement | ReactElement[];
}

function Spinner({ children, sizeClass, show = true }: SpinnerProps) {
  return (
    <>
      {show ? (
        <div className={`${css.loader} `}>
          <div className={`${css[sizeClass]}`}></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default Spinner;
