import css from "./Menu.module.scss";

interface MenuSeparatorProps {
  title?: string;
}

const MenuSeparator = ({ title }: MenuSeparatorProps) => {
  return (
    <>
      <div className={css["separator"]}></div>
      <span className={css["separator-title"]}>{title}</span>
    </>
  );
};

export default MenuSeparator;
