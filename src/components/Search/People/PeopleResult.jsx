import { result } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../../hook/useBase64Image";
import { userImageDownload } from "../../../services/userService";
import Spinner from "../../Spinner/Spinner";
import "./PeopleResult.css";
import {
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequestFromIds,
} from "../../../services/friendService";
import { useUser } from "../../../context/userContext";

function PeopleResult({ people, requested, pending, ownSelf }) {
  const { image: userImage, setService } = useBase64Image(null);
  const { user: currentUser } = useUser();

  const [pend, setPend] = useState();
  const [req, setReq] = useState();

  useEffect(() => {
    setService(userImageDownload(people.id));
  }, []);

  useEffect(() => {
    setReq(requested);
    setPend(pending);
  }, [requested, pending]);

  const handleCreateFriendRequest = async () => {
    await createFriendRequest({
      requestingUserId: currentUser.id,
      targetUserId: people.id,
    });
    setReq(true);
  };

  const handleCancelRequest = async () => {
    const { data } = await getFriendRequestFromIds(people.id, currentUser.id);
    deleteFriendRequest(data);
    setReq(false);
  };

  const renderButton = () => {
    if (req) {
      return (
        <button onClick={() => handleCancelRequest()} className="btn">
          <span className="people__add-friend">Cancel request</span>
        </button>
      );
    }
    if (pend) {
      return (
        <button className="btn btn--green">
          <span className="people__add-friend">Confirm request</span>
        </button>
      );
    }
    if (ownSelf) {
      return (
        <Link to={`/profile/${people.id}`}>
          <button className="btn">
            <span className="people__add-friend">View profile</span>
          </button>
        </Link>
      );
    }
    return (
      <button
        onClick={() => handleCreateFriendRequest()}
        className="btn btn--green"
      >
        <span className="people__add-friend">Add friend</span>
      </button>
    );
  };

  return (
    <div className="people__container">
      <div className="people__info">
        <Link to={`/profile/${people.id}`}>
          <Spinner
            show={!userImage}
            className="size--60"
            fragment={
              <img className="people__user-image size--60" src={userImage} />
            }
          />
        </Link>
        <Link to={`/profile/${people.id}`} className="people__name">
          {people.fullName}
        </Link>
      </div>
      {renderButton()}
    </div>
  );
}

export default PeopleResult;
