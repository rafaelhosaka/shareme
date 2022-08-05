import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import _ from "lodash";
import PostForm from "../../components/PostForm/PostForm";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { useUser } from "../../context/userContext";
import PostList from "../../components/Post/PostList";
import { getSharedPostByUsersId } from "../../services/shareService";

const Feed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);

  useEffect(() => {
    async function getPosts() {
      if (currentUser) {
        const posts = await postService.getPostsByUsersId(
          _.concat(currentUser.friends, currentUser.id)
        );

        const sharedPosts = await getSharedPostByUsersId(
          _.concat(currentUser.friends, currentUser.id)
        );

        setPosts([...posts, ...sharedPosts]);
      }
    }
    getPosts();
  }, []);

  const handleNewPost = (post: PostEntity) => {
    setPosts([post, ...posts]);
  };

  return (
    <>
      <main className="container center">
        <PostForm handleNewPost={handleNewPost} />
        <PostList posts={posts} />
      </main>
      <div className="footer">
        Rafael Hideki Hosaka © 2022 ShareMe {process.env.REACT_APP_VERSION}
      </div>
    </>
  );
};

export default Feed;
