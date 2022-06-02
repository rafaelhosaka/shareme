import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/userContext";
import {
  deleteFriendRequest,
  getPendingFriendRequest,
} from "../../../services/friendService";
import FriendRequest from "./FriendRequest";
import "./FriendRequest.css";

function FriendRequestList(props) {
  const { user: currentUser } = useUser();
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    async function getFriendRequests() {
      const { data } = await getPendingFriendRequest(currentUser.id);
      setFriendRequests(data);
    }
    getFriendRequests();
  }, []);

  const handleDelete = (request) => {
    deleteFriendRequest(request);
    setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  return (
    <div className="friend-request-list__container">
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        <FriendRequest
          key={request.id}
          request={request}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default FriendRequestList;
