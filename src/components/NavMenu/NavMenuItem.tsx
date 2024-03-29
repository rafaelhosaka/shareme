import { NavMenuItemProps } from "../../models/navMenu";
import css from "./NavMenu.module.scss";

function MenuItem({
  label,
  toMenuId,
  redirectToMenu,
  active = false,
  iconClass,
  children,
  boolean,
}: NavMenuItemProps) {
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
      {boolean !== undefined && (
        <div className={`${css["toggle"]} ${boolean && css["on"]}`}>
          <div
            className={`${css["toggle-circle"]} ${boolean && css["on"]}`}
          ></div>
        </div>
      )}
      {toMenuId && <i className="fa-solid fa-chevron-right fa-xl"></i>}
    </div>
  );
}

export default MenuItem;
