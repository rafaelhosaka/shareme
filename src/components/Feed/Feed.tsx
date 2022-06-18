import { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import { paginate } from "../../utils/paginate";
import _ from "lodash";

import Post from "../Post/Post";
import PostForm from "../Form/PostForm/PostForm";
import PostEntity from "../../models/post";
import PageInfoEntity from "../../models/pageInfo";
import { useUser } from "../../context/userContext";

const Feed = () => {
  const { user: currentUser } = useUser();
  const [posts, setPost] = useState<PostEntity[]>([]);
  const [pagedPosts, setPagedPosts] = useState<PostEntity[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfoEntity>({
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    async function getPosts() {
      if (currentUser) {
        const { data } = await postService.getPostsByUsersId(
          _.concat(currentUser.friends, currentUser.id)
        );

        const sorted: PostEntity[] = _.orderBy(data, "dateCreated", "desc");

        setPost(sorted);

        const paged: PostEntity[] = paginate(
          sorted,
          pageInfo.currentPage,
          pageInfo.pageSize
        );
        setPagedPosts(paged);
        window.addEventListener("scroll", onScroll);
      }
    }
    getPosts();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const paged = paginate(posts, pageInfo.currentPage, pageInfo.pageSize);
    const concatPages = [...pagedPosts, ...paged];
    setPagedPosts(concatPages);
  }, [pageInfo]);

  const onScroll = (e: Event) => {
    if (e.target instanceof Document) {
      let element: Element = e.target.scrollingElement as Element;
      if (element.scrollHeight - element.scrollTop <= element.clientHeight) {
        setPageInfo((prev) => ({
          ...prev,
          currentPage: prev.currentPage + 1,
        }));
        console.log("End of window");
      }
    }
  };

  const handleNewPost = (post: PostEntity) => {
    setPagedPosts([post, ...pagedPosts]);
  };

  return (
    <main className="container center">
      <PostForm handleNewPost={handleNewPost} />
      <div onScroll={(e) => onScroll(e.nativeEvent)}>
        {pagedPosts.map((post) => (
          <Post key={post.id} post={new PostEntity(post)} />
        ))}
      </div>
    </main>
  );
};

export default Feed;