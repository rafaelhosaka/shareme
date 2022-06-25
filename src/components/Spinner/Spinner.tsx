import css from "./Spinner.module.scss";

interface SpinnerProps {
  fragment: JSX.Element;
  sizeClass: string;
  show: boolean;
}

function Spinner({ fragment, sizeClass, show = true }: SpinnerProps) {
  return (
    <>
      {show ? (
        <div className={`${css.loader} `}>
          <div className={`${css[sizeClass]}`}></div>
        </div>
      ) : (
        fragment
      )}
    </>
  );
}

export default Spinner;
