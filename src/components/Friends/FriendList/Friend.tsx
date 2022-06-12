import UserProfileEntity from "../../../models/userProfile";
import { userImageDownload } from "../../../services/userService";
import css from "./Friend.module.scss";
import { useBase64Image } from "../../../hook/useBase64Image";
import Spinner from "../../Spinner/Spinner";
import { Link } from "react-router-dom";

interface FriendProps {
  friend: UserProfileEntity;
}

function Friend({ friend }: FriendProps) {
  const { image: userImage } = useBase64Image(userImageDownload(friend.id));

  return (
    <div className={`${css["friend__container"]} p2 m1`}>
      <Link to={`/profile/${friend.id}`}>
        <Spinner
          show={!userImage}
          sizeClass="size--80"
          fragment={
            <img
              className={`${css["friend-image"]} size--80`}
              src={userImage}
            />
          }
        />
      </Link>
      <Link to={`/profile/${friend.id}`}>
        <span className={css["friend-name"]}>{friend.fullName}</span>
      </Link>
    </div>
  );
}

export default Friend;
