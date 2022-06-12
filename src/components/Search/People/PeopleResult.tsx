import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../../hook/useBase64Image";
import { userImageDownload } from "../../../services/userService";
import Spinner from "../../Spinner/Spinner";
import {
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequestFromIds,
} from "../../../services/friendService";
import { useUser } from "../../../context/userContext";
import UserProfileEntity from "../../../models/userProfile";
import css from "./PeopleResult.module.scss";

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
  const { image: userImage, setService } = useBase64Image(null);
  const { user: currentUser } = useUser();

  const [pend, setPend] = useState<boolean>();
  const [req, setReq] = useState<boolean>();

  useEffect(() => {
    setService(userImageDownload(people.id));
  }, []);

  useEffect(() => {
    setReq(requested);
    setPend(pending);
  }, [requested, pending]);

  const handleCreateFriendRequest = async () => {
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

  const renderButton = () => {
    if (currentUser?.friends.includes(people.id)) {
      return (
        <button className="btn btn--secondary btn--small">
          <span className={css["people__add-friend"]}>Friend</span>
        </button>
      );
    }
    if (req) {
      return (
        <button
          onClick={() => handleCancelRequest()}
          className="btn btn--secondary"
        >
          <span className={css["people__add-friend"]}>Cancel request</span>
        </button>
      );
    }
    if (pend) {
      return (
        <button className="btn btn--primary">
          <span className={css["people__add-friend"]}>Confirm request</span>
        </button>
      );
    }
    if (ownSelf) {
      return (
        <Link to={`/profile/${people.id}`}>
          <button className="btn btn--secondary">
            <span className={css["people__add-friend"]}>View profile</span>
          </button>
        </Link>
      );
    }
    return (
      <button
        onClick={() => handleCreateFriendRequest()}
        className="btn btn--primary"
      >
        <span className={css["people__add-friend"]}>Add friend</span>
      </button>
    );
  };

  return (
    <div className={css["people__container"]}>
      <div className={css["people__info"]}>
        <Link to={`/profile/${people.id}`}>
          <Spinner
            show={!userImage}
            sizeClass="size--60"
            fragment={
              <img
                className={`${css["people__user-image"]} size--60`}
                src={userImage}
              />
            }
          />
        </Link>
        <Link to={`/profile/${people.id}`} className={css["people__name"]}>
          {people.fullName}
        </Link>
      </div>
      {renderButton()}
    </div>
  );
}

export default PeopleResult;
