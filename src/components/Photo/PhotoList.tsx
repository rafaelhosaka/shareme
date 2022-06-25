import css from "./Photo.module.scss";
import PostEntity from "../../models/post";
import Photo from "./Photo";

interface PhotoListProps {
  items: PostEntity[];
}

const PhotoList = ({ items }: PhotoListProps) => {
  let hasImage = false;

  return (
    <div className={css["photo-list__container"]}>
      <h2>Photos</h2>
      <div className={css["photo-list"]}>
        {items.map((item) => {
          if (item.fileName) {
            hasImage = true;
            return <Photo key={item.id} item={item} />;
          }
          return;
        })}
      </div>
      {!hasImage && (
        <div className={css["result"]}>You do not have any photos yet</div>
      )}
    </div>
  );
};

export default PhotoList;
