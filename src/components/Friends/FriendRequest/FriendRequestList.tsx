import { useUser } from "../../../context/userContext";
import FriendRequestEntity from "../../../models/friendRequest";
import {
  acceptFriendRequest,
  deleteFriendRequest,
} from "../../../services/friendService";
import { useAlert } from "../../Alert/Alert";
import FriendRequest from "./FriendRequest";
import css from "./FriendRequest.module.scss";
import UserProfileEntity from "../../../models/userProfile";

interface FriendRequestListProps {
  friendRequests: FriendRequestEntity[];
  setFriendRequests: React.Dispatch<
    React.SetStateAction<FriendRequestEntity[]>
  >;
}

function FriendRequestList({
  friendRequests,
  setFriendRequests,
}: FriendRequestListProps) {
  const { setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();

  const handleDelete = (request: FriendRequestEntity) => {
    deleteFriendRequest(request);
    setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  const handleConfirm = async (request: FriendRequestEntity) => {
    if (setUser) {
      const modifiedUsers = await acceptFriendRequest(request);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
      dispatchAlert("Friend request accepted", "success");
      setUser(new UserProfileEntity(modifiedUsers[1]));
    }
  };

  return (
    <div className={css["friend-request-list__container"]}>
      {alert}
      <h2>Friend Requests</h2>
      <div className={css["friend-requests"]}>
        {friendRequests.map((request) => (
          <FriendRequest
            key={request.id}
            request={request}
            handleDelete={handleDelete}
            handleConfirm={handleConfirm}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequestList;
