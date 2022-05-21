import React, { useState, useEffect } from "react";
import * as postService from "../../services/postService";
import { paginate } from "../../utils/paginate";
import _ from "lodash";

import Post from "../Post/Post";
import PostForm from "../Form/PostForm/PostForm";

const Feed = (props) => {
  const [posts, setPost] = useState([]);
  const [pagedPosts, setPagedPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, pageSize: 10 });

  useEffect(() => {
    async function getPosts() {
      const { data } = await postService.getPosts();

      const sorted = _.orderBy(data, "dateCreated", "desc");

      setPost(sorted);

      const paged = paginate(sorted, pageInfo.currentPage, pageInfo.pageSize);
      setPagedPosts(paged);

      window.addEventListener("scroll", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }

    getPosts();
  }, []);

  useEffect(() => {
    const paged = paginate(posts, pageInfo.currentPage, pageInfo.pageSize);
    const concatPages = [...pagedPosts, ...paged];
    setPagedPosts(concatPages);
  }, [pageInfo]);

  const onScroll = (e) => {
    let element = e.target.scrollingElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight) {
      setPageInfo({ currentPage: pageInfo.currentPage++, ...pageInfo });
      console.log("End of window");
    }
  };

  const handleNewPost = (post) => {
    setPagedPosts([post, ...pagedPosts]);
  };

  return (
    <main className="container">
      <PostForm handleNewPost={handleNewPost} />
      <div onScroll={(e) => onScroll(e)}>
        {pagedPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Feed;
