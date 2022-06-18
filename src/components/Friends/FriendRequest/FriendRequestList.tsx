import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useUser } from "../../../context/userContext";
import FriendRequestEntity from "../../../models/friendRequest";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getPendingFriendRequest,
} from "../../../services/friendService";
import { useAlert } from "../../Alert/Alert";
import FriendRequest from "./FriendRequest";
import css from "./FriendRequest.module.scss";

function FriendRequestList() {
  const { user: currentUser, setUser } = useUser();
  const [friendRequests, setFriendRequests] = useState<FriendRequestEntity[]>(
    []
  );
  const [alert, dispatchAlert] = useAlert();
  const { setFriendRequestCount } = useOutletContext<any>();

  useEffect(() => {
    async function getFriendRequests() {
      if (currentUser) {
        const { data } = await getPendingFriendRequest(currentUser.id);
        setFriendRequests(data);
      }
    }
    getFriendRequests();
  }, []);

  useEffect(() => {
    setFriendRequestCount(friendRequests.length);
  }, [friendRequests]);

  const handleDelete = (request: FriendRequestEntity) => {
    deleteFriendRequest(request);
    setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  const handleConfirm = async (request: FriendRequestEntity) => {
    if (setUser) {
      const modifiedUsers = await acceptFriendRequest(request);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
      dispatchAlert("Friend request accepted", "success");
      setUser(modifiedUsers[1]);
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
