import css from "./Menu.module.scss";
import { ReactElement } from "react";

interface MenuListProps {
  title: string;
  children: ReactElement | ReactElement[];
}

const MenuList = ({ title, children }: MenuListProps) => {
  return (
    <div className={css["menu__container"]}>
      <h1 className={css["menu__heading"]}>{title}</h1>
      <div className={css["menu__list"]}>{children}</div>
    </div>
  );
};

export default MenuList;
