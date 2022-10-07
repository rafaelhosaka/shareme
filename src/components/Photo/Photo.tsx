import { useEffect } from "react";
import { useBase64File } from "../../hook/useBase64File";
import { postImageDownload } from "../../services/postService";
import PostEntity from "../../models/post";
import css from "./Photo.module.scss";
import Spinner from "../Spinner/Spinner";

interface PhotoProps {
  item: PostEntity;
}

const Photo = ({ item }: PhotoProps) => {
  const {
    file,
    executeRequest: postImageDownloadExecute,
    cancelRequest: postImageDownloadCancel,
  } = useBase64File(postImageDownload);

  useEffect(() => {
    postImageDownloadExecute(item.id);

    return () => {
      postImageDownloadCancel();
    };
  }, []);

  return (
    <div className={css["photo__container"]}>
      <Spinner show={!file}>
        <img className={css["photo"]} src={file} />
      </Spinner>
    </div>
  );
};

export default Photo;
