import css from "./Spinner.module.scss";
import { ReactElement, useEffect, useRef } from "react";

interface SpinnerProps {
  sizeClass?: string;
  show: boolean;
  children: ReactElement | ReactElement[];
}

function Spinner({ children, sizeClass }: SpinnerProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const adjustSize = () => {
    if (spinnerRef.current && loaderRef.current) {
      const loader = loaderRef.current;
      const spinner = spinnerRef.current;

      spinner.style.height = loader.clientWidth + "px";

      spinner.classList.add(css["color"]);
      spinner.style.borderWidth = `${loader.clientWidth * 0.1}px`;
    }
  };

  useEffect(() => {
    adjustSize();
    window.addEventListener("resize", adjustSize);

    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  return (
    <>
      {true ? (
        <div ref={loaderRef} className={`${css.loader} ${sizeClass}`}>
          <div ref={spinnerRef}></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default Spinner;
