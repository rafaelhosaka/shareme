import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import _ from "lodash";
import PostForm from "../../components/PostForm/PostForm";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { useUser } from "../../context/userContext";
import PostList from "../../components/Post/PostList";
import Contacts from "../Contact/Contacts";
import css from "./Feed.module.scss";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";

const Feed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      if (currentUser) {
        const posts = await postService.getPostsByUsersId(
          _.concat(currentUser.friends, currentUser.id)
        );

        setPosts([...posts]);
        setLoading(false);
      }
    }
    getPosts();
  }, []);

  const handleNewPost = (post: PostEntity) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleDeletePost = (postId: string) => {
    postService.deletePost(postId);
    setPosts(posts.filter((p) => p.id !== postId));
  };

  return (
    <>
      <main className={`${css["feed"]} container center`}>
        <PostForm handleNewPost={handleNewPost} />
        {loading ? (
          <LoadingContainer />
        ) : (
          <PostList posts={posts} onDelete={handleDeletePost} />
        )}
      </main>
      <div className="right-content">
        <Contacts />
      </div>
    </>
  );
};

export default Feed;
