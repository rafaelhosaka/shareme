import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStateRef } from "../../hook/useStateRef";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { calculateMaxPage, paginate } from "../../utils/paginate";
import { useAlert } from "../Alert/Alert";
import Post from "./Post";
import css from "./Post.module.scss";

interface PostListProps {
  posts: (PostEntity | SharedPostEntity)[];
  onDelete?: (postId: string) => void;
  showGroupLabel?: boolean;
}

const PostList = ({
  posts,
  onDelete,
  showGroupLabel = false,
}: PostListProps) => {
  const { t } = useTranslation();
  const [pagedPosts, setPagedPosts] = useState<
    (PostEntity | SharedPostEntity)[]
  >([]);
  const [sortedPosts, setSortedPosts] = useState<
    (PostEntity | SharedPostEntity)[]
  >([]);
  const [currentPage, setCurrentValue, currentRef] = useStateRef(1);
  const [alert, dispatchAlert] = useAlert();

  const PAGE_SIZE = 10;
  const MAX_PAGE = calculateMaxPage(posts.length, PAGE_SIZE);

  function getPosts() {
    const sorted = posts.sort(function (a, b) {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);

      return dateB.getTime() - dateA.getTime();
    });

    setSortedPosts(sorted);

    const paged = paginate(sorted, currentPage, PAGE_SIZE);

    setPagedPosts(paged);
  }

  useEffect(() => {
    getPosts();
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  useEffect(() => {
    getPosts();
  }, [posts]);

  useEffect(() => {
    if (currentPage > 1) {
      const paged = paginate(sortedPosts, currentPage, PAGE_SIZE);

      const concatPages = [...pagedPosts, ...paged];

      setPagedPosts(concatPages);
    }
  }, [currentPage]);

  const handleDelete = (postId: string) => {
    if (onDelete) {
      onDelete(postId);
      dispatchAlert(t("POST.alertPostDeleted"), "success");
    }
  };

  const onScroll = () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
      if (currentRef.current < MAX_PAGE) {
        setCurrentValue(currentRef.current + 1);
      }
    }
  };

  const handleSharePost = async (sharedPost: SharedPostEntity) => {
    if (showGroupLabel) {
      setPagedPosts([sharedPost, ...pagedPosts]);
    }
  };

  return (
    <>
      {alert}
      {posts.length === 0 && (
        <div className={css["no-post"]}>{t("POST.noPosts")}</div>
      )}
      {pagedPosts.map((post) => (
        <Post
          key={post.id}
          data={post}
          onDelete={handleDelete}
          onShare={handleSharePost}
          showGroupLabel={showGroupLabel}
        ></Post>
      ))}
    </>
  );
};

export default PostList;
