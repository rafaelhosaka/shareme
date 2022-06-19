import { MenuListProps, isMenuItemProps } from "../../models/menu";
import css from "./Menu.module.scss";
import React from "react";

function MenuList({
  children,
  title,
  redirectToMenu,
  back,
  isMain,
}: MenuListProps) {
  const renderChildrenWithProps = () => {
    let childrenWithProps = children;

    if (children) {
      childrenWithProps = React.Children.map(children, (child) =>
        isMenuItemProps(child)
          ? React.cloneElement(child, { redirectToMenu: redirectToMenu })
          : React.cloneElement(child)
      );
    }

    return childrenWithProps;
  };

  return (
    <div className={`${css["menu-list-container"]} p1 `}>
      {(!isMain || title) && (
        <div className={css["menu-heading"]}>
          {!isMain && back && (
            <div onClick={() => back()} className={css["menu-back-btn"]}>
              <i className="fa-solid fa-arrow-left fa-xl"></i>
            </div>
          )}
          {title && <span className={css["menu-list-title"]}>{title}</span>}
        </div>
      )}
      <ul className={css["menu-list"]}>{renderChildrenWithProps()}</ul>
    </div>
  );
}

export default MenuList;
