import { useEffect, useState } from "react";
import { getUserById, userImageDownload } from "../../../services/userService";
import { useBase64Image } from "../../../hook/useBase64Image";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import FriendRequestEntity from "../../../models/friendRequest";
import UserProfileEntity from "../../../models/userProfile";

interface FriendRequestProps {
  request: FriendRequestEntity;
  handleDelete: (request: FriendRequestEntity) => void;
}

function FriendRequest({ request, handleDelete }: FriendRequestProps) {
  const { image, setService } = useBase64Image(null);
  const [user, setUser] = useState<UserProfileEntity>();

  useEffect(() => {
    async function getUser() {
      setUser(await getUserById(request.requestingUserId));
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
        <button className="btn m-1x0 btn--green">Confirm</button>
        <button onClick={() => handleDelete(request)} className="btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default FriendRequest;
