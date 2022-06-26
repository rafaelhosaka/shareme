import css from "./Menu.module.scss";
import { ReactElement } from "react";
import { useMediaQuery } from "react-responsive";
import { useToggle } from "../../hook/useToggle";

interface MenuListProps {
  title: string;
  children: ReactElement | ReactElement[];
}

const MenuList = ({ title, children }: MenuListProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [expanded, toggle] = useToggle(false);

  return (
    <div
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
