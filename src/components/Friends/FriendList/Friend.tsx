import UserProfileEntity from "../../../models/userProfile";
import { userImageDownload } from "../../../services/userService";
import css from "./Friend.module.scss";
import { useBase64Image } from "../../../hook/useBase64Image";
import Spinner from "../../Spinner/Spinner";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface FriendProps {
  friend: UserProfileEntity;
}

function Friend({ friend }: FriendProps) {
  const { image: userImage, setService } = useBase64Image(null);

  useEffect(() => {
    setService(userImageDownload(friend.id));
  }, []);

  return (
    <div className={`${css["friend__container"]} p2 m1`}>
      <Link to={`/profile/${friend.id}/posts`}>
        <Spinner show={!userImage} sizeClass="size--80">
          <img className={`${css["friend-image"]} size--80`} src={userImage} />
        </Spinner>
      </Link>
      <Link to={`/profile/${friend.id}/posts`}>
        <span className={css["friend-name"]}>{friend.fullName}</span>
      </Link>
    </div>
  );
}

export default Friend;
