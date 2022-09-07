import { ReactElement, SyntheticEvent } from "react";
import css from "./DropdownMenu.module.scss";

interface DropdownItemProps {
  label: string;
  children?: ReactElement;
  onClick?: (() => void) | ((e: SyntheticEvent) => void);
}

function DropdownItem({ label, children, onClick }: DropdownItemProps) {
  return (
    <li onClick={onClick} className={css["dropdown-menu__item"]}>
      {children}
      <span className={css["item__label"]}>{label}</span>
    </li>
  );
}

export default DropdownItem;
