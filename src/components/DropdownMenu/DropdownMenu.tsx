import { ReactElement } from "react";
import css from "./DropdownMenu.module.scss";

interface DropdownMenuProps {
  children: ReactElement | ReactElement[];
  position?: "center" | "right";
}

function DropdownMenu({ children, position = "center" }: DropdownMenuProps) {
  return (
    <div className={css["dropdown-menu__container"]}>
      <div className={`${css["dropdown-menu"]} ${css[position]}`}>
        <div className={css["triangle__container"]}>
          <div className={css["filler"]}></div>
          <div className={css["triangle"]}></div>
          <div className={css["filler"]}></div>
        </div>
        <ul className={css["dropdown-menu__list"]}>{children}</ul>
      </div>
    </div>
  );
}

export default DropdownMenu;
