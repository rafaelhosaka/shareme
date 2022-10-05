import { useEffect, useState } from "react";
import PostList from "../../components/Post/PostList";
import { useUser } from "../../context/userContext";
import PostEntity from "../../models/post";
import { getAllGroupsPosts } from "../../services/postService";
import css from "./GroupsFeed.module.scss";

const GroupsFeed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<PostEntity[]>([]);

  async function getPosts() {
    if (currentUser) {
      const { data } = await getAllGroupsPosts(currentUser.id);
      setPosts(data);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={css["feed"]}>
      <PostList posts={posts} />
    </div>
  );
};

export default GroupsFeed;
