import css from "./Menu.module.scss";
import { ReactElement, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useToggle } from "../../hook/useToggle";

interface MenuListProps {
  title: string;
  children: ReactElement | ReactElement[];
}

const MenuList = ({ title, children }: MenuListProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 769px)" });
  const [expanded, toggle] = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);

  function adjustSize() {
    let parent = document.getElementsByClassName("left-content");

    if (ref.current) {
      if (!isMobile && parent[0]) {
        ref.current.style.width = parent[0].clientWidth + "px";
      }

      if (isMobile && ref.current) {
        ref.current.style.width = "100%";
      }
    }
  }

  useEffect(() => {
    adjustSize();
    window.addEventListener("resize", adjustSize);

    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [isMobile]);

  return (
    <div
      ref={ref}
      className={
        isMobile && expanded
          ? `${css["menu__container"]} ${css["expanded"]}`
          : `${css["menu__container"]}`
      }
    >
      <h1 className={css["menu__heading"]}>{title}</h1>
      <div className={css["menu__list"]}>{children}</div>
      {isMobile && (
        <div onClick={toggle} className={css["toggle-btn"]}>
          {expanded ? (
            <i className="fa-solid fa-chevron-up"></i>
          ) : (
            <i className="fa-solid fa-angle-down"></i>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuList;
