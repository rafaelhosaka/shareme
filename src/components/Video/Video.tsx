import { useEffect } from "react";
import { useBase64Image } from "../../hook/useBase64Image";
import PostEntity from "../../models/post";
import { postImageDownload } from "../../services/postService";
import Spinner from "../Spinner/Spinner";
import css from "./Video.module.scss";

interface VideoProps {
  item: PostEntity;
}

const Video = ({ item }: VideoProps) => {
  const { image, setService } = useBase64Image(null);

  console.log(item);

  useEffect(() => {
    setService(postImageDownload(item.id));
  }, []);

  return (
    <div className={css["video__container"]}>
      <Spinner show={!image}>
        <video className={css["video"]}>
          <source src={image} />
        </video>
      </Spinner>
    </div>
  );
};

export default Video;
