import React, { useState, useEffect } from "react";
import * as photoService from "../../services/photoService";

import Post from "../Post/Post";

function Home(props) {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    async function getPhotos() {
      const { data } = await photoService.getPhotos();

      setPost(data);
    }

    getPhotos();
  }, []);

  return (
    <div>
      {posts.slice().map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
}

export default Home;
