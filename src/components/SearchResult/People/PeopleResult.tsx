import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../../hook/useBase64Image";
import { userImageDownload } from "../../../services/userService";
import Spinner from "../../Spinner/Spinner";
import {
  acceptFriendRequest,
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequestFromIds,
} from "../../../services/friendService";
import { useUser } from "../../../context/userContext";
import UserProfileEntity from "../../../models/userProfile";
import css from "./PeopleResult.module.scss";
import { useTranslation } from "react-i18next";

interface PeopleResultProps {
  people: UserProfileEntity;
  requested: boolean;
  pending: boolean;
  ownSelf: boolean;
}

function PeopleResult({
  people,
  requested,
  pending,
  ownSelf,
}: PeopleResultProps) {
  const { t } = useTranslation();
  const { image: userImage, setService } = useBase64Image(null);
  const { user: currentUser, setUser } = useUser();

  const [pend, setPend] = useState<boolean>();
  const [req, setReq] = useState<boolean>();

  useEffect(() => {
    setService(userImageDownload(people.id));
  }, []);

  useEffect(() => {
    setReq(requested);
    setPend(pending);
  }, [requested, pending]);

  const handleAddFriend = async () => {
    if (currentUser) {
      await createFriendRequest({
        requestingUserId: currentUser.id,
        targetUserId: people.id,
      });
      setReq(true);
    }
  };

  const handleCancelRequest = async () => {
    if (currentUser) {
      const { data } = await getFriendRequestFromIds(people.id, currentUser.id);
      deleteFriendRequest(data);
      setReq(false);
    }
  };

  const handleConfirm = async () => {
    if (currentUser && setUser) {
      const { data: request } = await getFriendRequestFromIds(
        currentUser.id,
        people.id
      );
      const modifiedUsers = await acceptFriendRequest(request);
      setUser(modifiedUsers[1]);
    }
  };

  const renderButton = () => {
    if (currentUser?.friends.includes(people.id)) {
      return (
        <button className="btn btn--secondary btn--small">
          {t("SEARCH.friend")}
        </button>
      );
    }
    if (req) {
      return (
        <button
          onClick={() => handleCancelRequest()}
          className="btn btn--small btn--secondary"
        >
          {t("SEARCH.cancelRequest")}
        </button>
      );
    }
    if (pend) {
      return (
        <button
          onClick={() => handleConfirm()}
          className="btn btn--small btn--primary"
        >
          {t("SEARCH.confirmRequest")}
        </button>
      );
    }
    if (ownSelf) {
      return (
        <Link to={`/profile/${people.id}/posts`}>
          <button className="btn btn--small btn--secondary">
            {t("SEARCH.viewProfile")}
          </button>
        </Link>
      );
    }
    return (
      <button
        onClick={() => handleAddFriend()}
        className="btn btn--small btn--primary"
      >
        {t("SEARCH.addFriend")}
      </button>
    );
  };

  return (
    <div className={css["people__container"]}>
      <div className={css["people__info"]}>
        <Link to={`/profile/${people.id}/posts`}>
          <Spinner show={!userImage} sizeClass="size--60">
            <img
              className={`${css["people__user-image"]} size--60`}
              src={userImage}
            />
          </Spinner>
        </Link>
        <Link
          to={`/profile/${people.id}/posts`}
          className={css["people__name"]}
        >
          {people.fullName}
        </Link>
      </div>
      {renderButton()}
    </div>
  );
}

export default PeopleResult;
