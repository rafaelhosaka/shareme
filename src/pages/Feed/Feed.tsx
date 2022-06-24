import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import _ from "lodash";
import PostForm from "../../components/PostForm/PostForm";
import PostEntity from "../../models/post";
import { useUser } from "../../context/userContext";
import PostList from "../../components/Post/PostList";

const Feed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<PostEntity[]>([]);

  useEffect(() => {
    async function getPosts() {
      if (currentUser) {
        const { data } = await postService.getPostsByUsersId(
          _.concat(currentUser.friends, currentUser.id)
        );
        setPosts(data);
      }
    }
    getPosts();
  }, []);

  const handleNewPost = (post: PostEntity) => {
    setPosts([post, ...posts]);
  };

  return (
    <main className="container center">
      <PostForm handleNewPost={handleNewPost} />
      <PostList posts={posts} />
    </main>
  );
};

export default Feed;
