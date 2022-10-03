import css from "./Photo.module.scss";
import PostEntity from "../../models/post";
import Photo from "./Photo";
import { useTranslation } from "react-i18next";

interface PhotoListProps {
  items: PostEntity[];
}

const PhotoList = ({ items }: PhotoListProps) => {
  const { t } = useTranslation();

  return (
    <div className={css["photo-list__container"]}>
      <h2>{t("PHOTO.photos")}</h2>
      <div className={css["photo-list"]}>
        {items.map((item) => {
          return <Photo key={item.id} item={item} />;
        })}
      </div>
      {items.length === 0 && (
        <div className={css["result"]}>{t("PHOTO.noPhoto")}</div>
      )}
    </div>
  );
};

export default PhotoList;
