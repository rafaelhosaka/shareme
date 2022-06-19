import { ReactElement } from "react";
import css from "./Menu.module.scss";

interface MenuItemProps {
  active?: boolean;
  children: ReactElement;
}

const MenuItem = ({ children, active = false }: MenuItemProps) => {
  return (
    <div
      className={
        active ? `${css["menu__item"]} ${css["active"]}` : css["menu__item"]
      }
    >
      {children}
    </div>
  );
};

export default MenuItem;
