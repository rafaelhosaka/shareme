import { useEffect, useState } from "react";
import { getUserById, userImageDownload } from "../../../services/userService";
import { useBase64File } from "../../../hook/useBase64File";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import FriendRequestEntity from "../../../models/friendRequest";
import UserProfileEntity from "../../../models/userProfile";

import css from "./FriendRequest.module.scss";
import { useTranslation } from "react-i18next";
import { fullName } from "../../../utils/formatedNames";

interface FriendRequestProps {
  request: FriendRequestEntity;
  handleDelete: (request: FriendRequestEntity) => void;
  handleConfirm: (request: FriendRequestEntity) => void;
}

function FriendRequest({
  request,
  handleDelete,
  handleConfirm,
}: FriendRequestProps) {
  const { t } = useTranslation();
  const { file: friendImage, setService } = useBase64File(null);
  const [user, setUser] = useState<UserProfileEntity>();

  useEffect(() => {
    async function getUser() {
      setUser(await getUserById(request.requestingUserId));
    }
    getUser();
    setService(userImageDownload(request.requestingUserId));
  }, []);

  return (
    <div className={`${css["friend-request__container"]} m2`}>
      <Link to={`/profile/${request.requestingUserId}/posts`}>
        <Spinner show={!friendImage} sizeClass="size--200">
          <img
            src={friendImage}
            className={css["friend-request__user-image"]}
          />
        </Spinner>
      </Link>
      <div className={css["friend-request__body"]}>
        <Link
          className={css["friend-request__user-name"]}
          to={`/profile/${request.requestingUserId}/posts`}
        >
          {fullName(user)}
        </Link>
        <button
          onClick={() => handleConfirm(request)}
          className="btn my-1 btn--primary"
        >
          {t("FRIENDS.confirm")}
        </button>
        <button onClick={() => handleDelete(request)} className="btn">
          {t("FRIENDS.delete")}
        </button>
      </div>
    </div>
  );
}

export default FriendRequest;
