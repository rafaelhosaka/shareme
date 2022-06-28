import _ from "lodash";
import { useEffect, useState } from "react";
import { useStateRef } from "../../hook/useStateRef";
import PostEntity from "../../models/post";
import { deletePost } from "../../services/postService";
import { calculateMaxPage, paginate } from "../../utils/paginate";
import { useAlert } from "../Alert/Alert";
import Post from "./Post";

interface PostListProps {
  posts: PostEntity[];
}

const PostList = ({ posts }: PostListProps) => {
  const [pagedPosts, setPagedPosts] = useState<PostEntity[]>([]);
  const [sortedPosts, setSortedPosts] = useState<PostEntity[]>([]);
  const [currentPage, setCurrentValue, currentRef] = useStateRef(1);
  const [alert, dispatchAlert] = useAlert();

  const PAGE_SIZE = 10;
  const MAX_PAGE = calculateMaxPage(posts.length, PAGE_SIZE);

  useEffect(() => {
    function getPosts() {
      const sorted: PostEntity[] = _.orderBy(posts, "dateCreated", "desc");
      setSortedPosts(sorted);

      const paged: PostEntity[] = paginate(sorted, currentPage, PAGE_SIZE);

      setPagedPosts(paged);
      window.addEventListener("scroll", onScroll, true);
    }

    getPosts();

    return () => {
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [posts]);

  useEffect(() => {
    const paged = paginate(sortedPosts, currentPage, PAGE_SIZE);
    const concatPages = [...pagedPosts, ...paged];
    setPagedPosts(concatPages);
  }, [currentPage]);

  const handleDelete = (post: PostEntity) => {
    deletePost(post);
    setPagedPosts(pagedPosts.filter((p) => p.id !== post.id));
    dispatchAlert("Post deleted successfully", "success");
  };

  const onScroll = () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
      if (currentRef.current < MAX_PAGE) {
        setCurrentValue(currentRef.current + 1);
      }
    }
  };

  return (
    <div>
      {alert}
      {pagedPosts.map((post) => (
        <Post
          key={post.id}
          post={new PostEntity(post)}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default PostList;
