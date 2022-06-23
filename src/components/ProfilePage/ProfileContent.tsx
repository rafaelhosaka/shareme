import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostEntity from "../../models/post";
import UserProfileEntity from "../../models/userProfile";
import { getPostsByUsersId } from "../../services/postService";
import { getUserById, getUsersFromIds } from "../../services/userService";
import FriendList from "../Friends/FriendList/FriendList";
import PostList from "../Post/PostList";
import css from "./Profile.module.scss";

const ProfileContent = () => {
  const { id } = useParams();
  const { option } = useParams();

  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);

  async function getPosts(id: string) {
    const { data } = await getPostsByUsersId([id]);
    setPosts(data);
  }

  async function getFriends(id: string) {
    const user = await getUserById(id);
    const data = await getUsersFromIds(user.friends);
    setFriends(data);
  }

  useEffect(() => {
    setPosts([]);
    setFriends([]);

    if (id) {
      switch (option) {
        case "posts":
          getPosts(id);
          break;
        case "friends":
          getFriends(id);
          break;
      }
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      switch (option) {
        case "posts":
          if (posts.length === 0) getPosts(id);
          break;
        case "friends":
          if (friends.length === 0) getFriends(id);
          break;
      }
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
    </>
  );
};

export default ProfileContent;
