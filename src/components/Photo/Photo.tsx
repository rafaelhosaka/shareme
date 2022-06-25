import { useEffect } from "react";
import { useBase64Image } from "../../hook/useBase64Image";
import { postImageDownload } from "../../services/postService";
import PostEntity from "../../models/post";
import css from "./Photo.module.scss";

interface PhotoProps {
  item: PostEntity;
}

const Photo = ({ item }: PhotoProps) => {
  const { image, setService } = useBase64Image(null);

  useEffect(() => {
    setService(postImageDownload(item.id));
  }, []);

  return (
    <div className={css["photo__container"]}>
      <img className={css["photo"]} src={image} />
    </div>
  );
};

export default Photo;
