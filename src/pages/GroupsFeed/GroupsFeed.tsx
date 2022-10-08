import { useEffect, useState } from "react";
import PostList from "../../components/Post/PostList";
import { useUser } from "../../context/userContext";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { getAllGroupsPosts } from "../../services/postService";
import { initPosts } from "../../utils/postUtils";
import css from "./GroupsFeed.module.scss";

const GroupsFeed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);

  async function getPosts() {
    if (currentUser) {
      const { data } = await getAllGroupsPosts(currentUser.id);
      const posts = initPosts(data);
      setPosts(posts);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={css["feed"]}>
      <PostList posts={posts} showGroupLabel={true} />
    </div>
  );
};

export default GroupsFeed;
