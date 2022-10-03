import { useTranslation } from "react-i18next";
import PostEntity from "../../models/post";
import Video from "./Video";
import css from "./Video.module.scss";

interface VideoListProps {
  items: PostEntity[];
}

const VideoList = ({ items }: VideoListProps) => {
  const { t } = useTranslation();

  return (
    <div className={css["video-list__container"]}>
      <h2>{t("VIDEO.videos")}</h2>
      <div className={css["video-list"]}>
        {items.map((item) => {
          if (item.fileType?.startsWith("video")) {
            return <Video key={item.id} item={item} />;
          }
          return;
        })}
      </div>
      {items.length === 0 && (
        <div className={css["result"]}>{t("VIDEO.noVideo")}</div>
      )}
    </div>
  );
};

export default VideoList;
