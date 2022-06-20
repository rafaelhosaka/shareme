import { useUser } from "../../../context/userContext";
import SearchBar from "../../SearchBar/SearchBar";
import Friend from "./Friend";

import css from "./Friend.module.scss";
import { useEffect, useState } from "react";
import UserProfileEntity from "../../../models/userProfile";
import { getUsersFromIds } from "../../../services/userService";

function FriendList() {
  const { user } = useUser();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<UserProfileEntity[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getFriends() {
      if (user) {
        const friends = await getUsersFromIds(user.friends);
        setFriends(friends);
        setFilteredFriends(friends);
      }
    }
    getFriends();
  }, []);

  const renderFriends = () => {
    if (friends.length === 0) {
      return (
        <div className={css["result"]}>You do not have any friends yet</div>
      );
    }

    return filteredFriends.length === 0 ? (
      <div className={css["result"]}>No result for : {searchQuery}</div>
    ) : (
      <div className={css["friend-list"]}>
        {filteredFriends.map((friend) => (
          <Friend key={friend.id} friend={new UserProfileEntity(friend)} />
        ))}
      </div>
    );
  };

  const handleChange = (searchQuery: string | undefined) => {
    if (!searchQuery) {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((f) =>
        f.firstName.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
      setSearchQuery(searchQuery);
    }
  };

  return (
    <div className={`${css["friend-list__container"]} p2`}>
      <header className={css["heading"]}>
        <h2>Friends</h2>
        <SearchBar placeHolder="Search" onChange={handleChange} />
      </header>
      {renderFriends()}
    </div>
  );
}

export default FriendList;
