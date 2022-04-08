import React, { useState, useEffect, useRef } from "react";
import * as photoService from "../../services/photoService";
import { paginate } from "../../utils/paginate";

import Post from "../Post/Post";

const Home = (props) => {
  const [posts, setPost] = useState([]);
  const [pagedPosts, setPagedPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, pageSize: 10 });

  useEffect(() => {
    async function getPhotos() {
      const { data } = await photoService.getPhotos();
      setPost(data);
      const paged = paginate(data, pageInfo.currentPage, pageInfo.pageSize);
      setPagedPosts(paged);

      window.addEventListener("scroll", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }

    getPhotos();
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
    <div onScroll={() => onScroll()}>
      {pagedPosts.slice().map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
