import { useEffect, useState } from "react";
import FriendList from "../../components/Friends/FriendList/FriendList";
import UserProfileEntity from "../../models/userProfile";
import { getUserFriends } from "../../services/userService";
import { useUser } from "../../context/userContext";
import { useParams } from "react-router";
import FriendRequestList from "../../components/Friends/FriendRequest/FriendRequestList";
import FriendRequestEntity from "../../models/friendRequest";
import { getPendingFriendRequest } from "../../services/friendService";
import { useStompContext } from "../../context/stompContext";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";

interface FriendMenuContentProps {
  setRequestCount?: (quantity: number) => void;
}

function FriendMenuContent({ setRequestCount }: FriendMenuContentProps) {
  const { user } = useUser();
  const { option } = useParams();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestEntity[]>(
    []
  );
  const {
    receivedNewRequest,
    receivedNewFriend,
    receivedRemovedFriend,
    receivedRemovedRequest,
  } = useStompContext();
  const [loading, setLoading] = useState(true);

  async function getFriends() {
    if (user) {
      const { data } = await getUserFriends(user.id);
      setFriends(data);
      setLoading(false);
    }
  }

  async function getFriendRequests() {
    if (user) {
      const { data } = await getPendingFriendRequest(user.id);
      setFriendRequests(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    switch (option) {
      case "all":
        getFriends();
        break;
      case "request":
        getFriendRequests();
        break;
    }
  }, [option]);

  useEffect(() => {
    if (setRequestCount) setRequestCount(friendRequests.length);
  }, [friendRequests]);

  useEffect(() => {
    if (receivedNewRequest) {
      setFriendRequests([...friendRequests, receivedNewRequest]);
    }
  }, [receivedNewRequest]);

  useEffect(() => {
    if (receivedRemovedRequest) {
      setFriendRequests(
        friendRequests.filter(
          (req) =>
            req.requestingUserId !== receivedRemovedRequest.requestingUserId
        )
      );
    }
  }, [receivedRemovedRequest]);

  useEffect(() => {
    if (receivedRemovedFriend) {
      setFriends(
        friends.filter((f) => f.id !== receivedRemovedFriend.friend.id)
      );
    }
  }, [receivedRemovedFriend]);

  useEffect(() => {
    if (receivedNewFriend) {
      setFriends([...friends, receivedNewFriend.friend]);
    }
  }, [receivedNewFriend]);

  const renderContent = () => {
    if (loading) {
      return <LoadingContainer labelSize="medium" />;
    }
    switch (option) {
      case "all":
        return <FriendList friends={friends} />;
      case "request":
        return (
          <FriendRequestList
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        );
    }
    return <></>;
  };

  return renderContent();
}

export default FriendMenuContent;
