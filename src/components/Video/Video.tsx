import { useEffect } from "react";
import { useBase64File } from "../../hook/useBase64File";
import PostEntity from "../../models/post";
import { postImageDownload } from "../../services/postService";
import Spinner from "../Spinner/Spinner";
import css from "./Video.module.scss";

interface VideoProps {
  item: PostEntity;
}

const Video = ({ item }: VideoProps) => {
  const {
    file,
    executeRequest: postImageDownloadExecute,
    cancelRequest: postImageDownloadCancel,
  } = useBase64File(postImageDownload);

  console.log(item);

  useEffect(() => {
    postImageDownloadExecute(item.id);

    return () => {
      postImageDownloadCancel();
    };
  }, []);

  return (
    <div className={css["video__container"]}>
      <Spinner show={!file}>
        <video className={css["video"]}>
          <source src={file} />
        </video>
      </Spinner>
    </div>
  );
};

export default Video;
