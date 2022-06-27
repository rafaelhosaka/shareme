import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostEntity from "../../models/post";
import UserProfileEntity from "../../models/userProfile";
import { getPostsByUsersId } from "../../services/postService";
import { getUsersFromIds } from "../../services/userService";
import FriendList from "../../components/Friends/FriendList/FriendList";
import PostList from "../../components/Post/PostList";
import css from "./Profile.module.scss";
import PhotoList from "../../components/Photo/PhotoList";

interface ProfileContentProps {
  user: UserProfileEntity;
}

const ProfileContent = ({ user }: ProfileContentProps) => {
  const { option } = useParams();

  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);

  async function getPosts() {
    const { data } = await getPostsByUsersId([user.id]);
    setPosts(data);
  }

  async function getFriends() {
    const data = await getUsersFromIds(user.friends);
    setFriends(data);
  }

  useEffect(() => {
    setPosts([]);
    setFriends([]);

    switch (option) {
      case "posts":
        getPosts();
        break;
      case "friends":
        getFriends();
        break;
    }
  }, [user]);

  useEffect(() => {
    switch (option) {
      case "posts":
        if (posts.length === 0) getPosts();
        break;
      case "friends":
        if (friends.length === 0) getFriends();
        break;
    }
  }, [option]);

  return (
    <>
      <div
        className={
          option === "posts"
            ? `${css["profile-content-container"]} ${css["show"]}`
            : `${css["profile-content-container"]}`
        }
      >
        <PostList posts={posts} />
      </div>
      <div
        className={
          option === "friends"
            ? `${css["profile-content-container"]} ${css["show"]}`
            : `${css["profile-content-container"]}`
        }
      >
        <FriendList friends={friends} />
      </div>
      <div
        className={
          option === "photos"
            ? `${css["profile-content-container"]} ${css["show"]}`
            : `${css["profile-content-container"]}`
        }
      >
        <PhotoList items={posts} />
      </div>
    </>
  );
};

export default ProfileContent;
