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

interface FriendMenuContentProps {
  setRequestCount?: (quantity: number) => void;
}

function FriendMenuContent({ setRequestCount }: FriendMenuContentProps) {
  const { user, setUser } = useUser();
  const { option } = useParams();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestEntity[]>(
    []
  );
  const { receivedRequest, receivedNewFriend } = useStompContext();

  async function getFriends() {
    if (user) {
      const { data } = await getUserFriends(user.id);
      setFriends(data);
    }
  }

  async function getFriendRequests() {
    if (user) {
      const { data } = await getPendingFriendRequest(user.id);
      setFriendRequests(data);
    }
  }

  useEffect(() => {
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
    if (receivedRequest) {
      setFriendRequests([...friendRequests, receivedRequest]);
    }
  }, [receivedRequest]);

  useEffect(() => {
    if (receivedNewFriend && setUser && user) {
      user.friends.push(receivedNewFriend.newFriend.id);
      setUser(user);
      setFriends([...friends, receivedNewFriend.newFriend]);
    }
  }, [receivedNewFriend]);

  const renderContent = () => {
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
