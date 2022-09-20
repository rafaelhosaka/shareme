import { useEffect, useState } from "react";
import FriendList from "../../components/Friends/FriendList/FriendList";
import UserProfileEntity from "../../models/userProfile";
import { getUsersFromIds } from "../../services/userService";
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
  const { user } = useUser();
  const { option } = useParams();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestEntity[]>(
    []
  );
  const { receivedRequest } = useStompContext();

  async function getFriends() {
    if (user) {
      const data = await getUsersFromIds(user.friends);
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
