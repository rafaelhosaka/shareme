import React, { useState, useEffect, useRef } from "react";
import * as postService from "../../services/postService";
import { paginate } from "../../utils/paginate";
import _ from "lodash";

import Post from "../Post/Post";
import PostForm from "../Form/PostForm/PostForm";

const Home = (props) => {
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

  const onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPageInfo({ currentPage: pageInfo.currentPage++, ...pageInfo });
      console.log("End of window");
    }
  };

  return (
    <>
      <PostForm />
      <div onScroll={() => onScroll()}>
        {pagedPosts.slice().map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Home;
