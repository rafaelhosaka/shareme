import React, { useEffect, useState } from "react";
import { getUserById, userImageDownload } from "../../../services/userService";
import { useBase64Image } from "../../../hook/useBase64Image";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import { deleteFriendRequest } from "../../../services/friendService";

function FriendRequest({ request, handleDelete }) {
  const { image, setService } = useBase64Image(null);
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      const { data } = await getUserById(request.requestingUserId);
      setUser(data);
    }
    getUser();
    setService(userImageDownload(request.requestingUserId));
  }, []);

  return (
    <div className="friend-request__container">
      <Link to={`/profile/${request.requestingUserId}`}>
        <Spinner
          show={!image}
          className="size--200"
          fragment={<img src={image} className="friend-request__user-image" />}
        />
      </Link>
      <div className="friend-request__body">
        <Link
          className="friend-request__user-name"
          to={`/profile/${request.requestingUserId}`}
        >
          {user?.fullName}
        </Link>
        <button className="btn btn--green btn--no-margin">Confirm</button>
        <button onClick={() => handleDelete(request)} className="btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default FriendRequest;
