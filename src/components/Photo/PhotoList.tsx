import css from "./Photo.module.scss";
import PostEntity from "../../models/post";
import Photo from "./Photo";
import { useTranslation } from "react-i18next";

interface PhotoListProps {
  items: PostEntity[];
}

const PhotoList = ({ items }: PhotoListProps) => {
  const { t } = useTranslation();
  let hasImage = false;

  return (
    <div className={css["photo-list__container"]}>
      <h2>{t("PHOTO.photos")}</h2>
      <div className={css["photo-list"]}>
        {items.map((item) => {
          if (item.fileName) {
            hasImage = true;
            return <Photo key={item.id} item={item} />;
          }
          return;
        })}
      </div>
      {!hasImage && <div className={css["result"]}>{t("PHOTO.noPhoto")}</div>}
    </div>
  );
};

export default PhotoList;
