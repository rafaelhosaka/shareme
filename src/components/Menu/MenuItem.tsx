import { MenuItemProps } from "../../models/menu";
import css from "./Menu.module.scss";

function MenuItem({
  label,
  toMenuId,
  redirectToMenu,
  active = false,
  iconClass,
  children,
}: MenuItemProps) {
  const getIcon = () => {
    return iconClass ? (
      <div className={`${css["menu-item-icon"]} size--40`}>
        <i className={`${iconClass}`}></i>
      </div>
    ) : (
      <></>
    );
  };

  return (
    <div
      onClick={toMenuId ? () => redirectToMenu?.(toMenuId) : undefined}
      className={
        active
          ? `${css.active} ${css["menu-item-container"]}`
          : css["menu-item-container"]
      }
    >
      <div className={css["menu-item"]}>
        {children}
        {getIcon()}
        <li>{label}</li>
      </div>
      {toMenuId && <i className="fa-solid fa-chevron-right fa-xl"></i>}
    </div>
  );
}

export default MenuItem;
