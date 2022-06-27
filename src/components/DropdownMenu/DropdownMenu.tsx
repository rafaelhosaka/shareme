import { ReactElement } from "react";
import css from "./DropdownMenu.module.scss";

interface DropdownMenuProps {
  children: ReactElement | ReactElement[];
}

function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div className={css["dropdown-menu__container"]}>
      <div className={css["dropdown-menu"]}>
        <div className={css["triangle"]}></div>
        <ul className={css["dropdown-menu__list"]}>{children}</ul>
      </div>
    </div>
  );
}

export default DropdownMenu;
