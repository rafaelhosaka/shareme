import { useState, useEffect } from "react";
import _ from "lodash";
import PostForm from "../../components/PostForm/PostForm";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { useUser } from "../../context/userContext";
import PostList from "../../components/Post/PostList";
import Contacts from "../Contact/Contacts";
import css from "./Feed.module.scss";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import { useMediaQuery } from "react-responsive";
import { UserProfileDTO } from "../../models/userProfile";
import { useCancellableRequest } from "../../hook/useCancellableRequest";
import {
  deletePost,
  getPostsByUsersId,
  savePost,
} from "../../services/postService";
import { initPosts } from "../../utils/postUtils";

const Feed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);
  const [loading, setLoading] = useState(true);
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [execute, cancel] = useCancellableRequest(getPostsByUsersId);

  useEffect(() => {
    async function getPosts() {
      if (currentUser) {
        const { data } = await execute(
          _.concat(currentUser.friends, currentUser.id)
        );
        const posts = initPosts(data);

        setPosts([...posts]);
        setLoading(false);
      }
    }
    getPosts();

    return () => {
      cancel();
    };
  }, []);

  const handleNewPost = async (description: string, file: File) => {
    if (currentUser) {
      const post = await savePost(
        JSON.stringify({ user: new UserProfileDTO(currentUser), description }),
        file
      );
      setPosts((prev) => [post, ...prev]);
    }
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
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
      {!isTablet && (
        <div className="right-content">
          <Contacts />
        </div>
      )}
    </>
  );
};

export default Feed;
