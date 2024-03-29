import UserProfileEntity from "../../../models/userProfile";
import { userImageDownload } from "../../../services/userService";
import css from "./Friend.module.scss";
import { useBase64File } from "../../../hook/useBase64File";
import Spinner from "../../Spinner/Spinner";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fullName } from "../../../utils/formatedNames";

interface FriendProps {
  friend: UserProfileEntity;
}

function Friend({ friend }: FriendProps) {
  const {
    file: userImage,
    executeRequest: userImageDownloadExecute,
    cancelRequest: userImageDownloadCancel,
  } = useBase64File(userImageDownload);

  useEffect(() => {
    userImageDownloadExecute(friend.id);

    return () => {
      userImageDownloadCancel();
    };
  }, []);

  return (
    <div className={`${css["friend__container"]} p2 m1`}>
      <Link to={`/profile/${friend.id}/posts`}>
        <Spinner show={!userImage} sizeClass="size--80">
          <img className={`${css["friend-image"]} size--80`} src={userImage} />
        </Spinner>
      </Link>
      <Link to={`/profile/${friend.id}/posts`}>
        <span className={css["friend-name"]}>{fullName(friend)}</span>
      </Link>
    </div>
  );
}

export default Friend;
