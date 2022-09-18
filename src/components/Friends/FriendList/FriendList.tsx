import SearchBar from "../../SearchBar/SearchBar";
import Friend from "./Friend";

import css from "./Friend.module.scss";
import { useEffect, useState } from "react";
import UserProfileEntity from "../../../models/userProfile";
import { useTranslation } from "react-i18next";

interface FriendListProps {
  friends: UserProfileEntity[];
}

function FriendList({ friends }: FriendListProps) {
  const { t } = useTranslation();
  const [filteredFriends, setFilteredFriends] = useState<UserProfileEntity[]>(
    []
  );

  useEffect(() => {
    async function getFriends() {
      if (friends) {
        setFilteredFriends(friends);
      }
    }

    getFriends();
  }, [friends]);

  const renderFriends = () => {
    if (friends?.length === 0) {
      return <div className={css["result"]}>{t("FRIENDS.noFriend")}</div>;
    }

    return filteredFriends.length === 0 ? (
      <div className={css["result"]}>{t("FRIENDS.noResult")}</div>
    ) : (
      <div className={css["friend-list"]}>
        {filteredFriends.map((friend) => (
          <Friend key={friend.id} friend={new UserProfileEntity(friend)} />
        ))}
      </div>
    );
  };

  const handleChange = (searchQuery: string | undefined) => {
    if (friends)
      if (!searchQuery) {
        setFilteredFriends(friends);
      } else {
        const filtered = friends.filter((f) => {
          if (f.firstName.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            return f;
          }
          if (f.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())) {
            return f;
          }
          return;
        });

        setFilteredFriends(filtered);
      }
  };

  return (
    <div className={`${css["friend-list__container"]} p2`}>
      <header className={css["heading"]}>
        <h2>{t("FRIENDS.friends")}</h2>
        <SearchBar placeHolder={t("FRIENDS.search")} onChange={handleChange} />
      </header>
      {renderFriends()}
    </div>
  );
}

export default FriendList;
