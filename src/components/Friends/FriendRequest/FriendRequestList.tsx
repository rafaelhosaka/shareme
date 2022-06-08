import { useState, useEffect } from "react";
import { useUser } from "../../../context/userContext";
import FriendRequestEntity from "../../../models/friendRequest";
import {
  deleteFriendRequest,
  getPendingFriendRequest,
} from "../../../services/friendService";
import FriendRequest from "./FriendRequest";
import css from "./FriendRequest.module.scss";

function FriendRequestList() {
  const { user: currentUser } = useUser();
  const [friendRequests, setFriendRequests] = useState<FriendRequestEntity[]>(
    []
  );

  useEffect(() => {
    async function getFriendRequests() {
      if (currentUser) {
        const { data } = await getPendingFriendRequest(currentUser.id);
        setFriendRequests(data);
      }
    }
    getFriendRequests();
  }, []);

  const handleDelete = (request: FriendRequestEntity) => {
    deleteFriendRequest(request);
    setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  return (
    <div className={css["friend-request-list__container"]}>
      <h2>Friend Requests</h2>
      <div className={css["friend-requests"]}>
        {friendRequests.map((request) => (
          <FriendRequest
            key={request.id}
            request={request}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequestList;
