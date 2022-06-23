import { useRef, useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import { postImageDownload } from "../../services/postService";
import { userImageDownload } from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import { useUser } from "../../context/userContext";
import NewComment from "../Comment/NewComment";
import Comment from "../Comment/Comment";
import { likePost } from "../../services/likeService";
import { paginate } from "../../utils/paginate";
import { Link } from "react-router-dom";

import Spinner from "../Spinner/Spinner";
import PostEntity from "../../models/post";
import CommentEntity from "../../models/comment";

import css from "./Post.module.scss";
import PageInfoEntity from "../../models/pageInfo";

interface PostProps {
  post: PostEntity;
}

function Post(props: PostProps) {
  const [post, setPost] = useState(props.post);
  const { image: postImage, setService: setPostImageService } =
    useBase64Image(null);
  const { image: postUserImage, setService: setPostUserService } =
    useBase64Image(null);
  const { user: currentUser } = useUser();
  const inputNewCommentRef = useRef<HTMLInputElement>(null);
  const [showComments, setShowComments] = useState(false);

  const [pagedComments, setPagedComments] = useState<CommentEntity[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [pageInfo, setPageInfo] = useState<PageInfoEntity>({
    currentPage: 1,
    pageSize: 5,
  });

  useEffect(() => {
    setPostUserService(userImageDownload(post.user.id));
    setPostImageService(postImageDownload(post.id));
  }, []);

  useEffect(() => {
    if (showComments) focus();
  }, [showComments]);

  useEffect(() => {
    const paged = paginate(
      post.comments,
      pageInfo.currentPage,
      pageInfo.pageSize
    );
    const concatPages = [...pagedComments, ...paged];
    setPagedComments(concatPages);
  }, [pageInfo]);

  const loadMoreComments = () => {
    setPageInfo((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };

  const handleLike = async () => {
    if (currentUser) {
      const { data } = await likePost(currentUser.id, post.id);
      setPost(new PostEntity(data));
      if (!liked) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  };

  const handleNewComment = (comment: CommentEntity) => {
    setPagedComments([comment, ...pagedComments]);
    setCommentCount((prev) => prev + 1);
  };

  const isLiked = post.likes.some((like) => {
    if (currentUser) return like.userId === currentUser.id;
    return;
  });

  const [liked, setLiked] = useState(isLiked);

  const focus = () => {
    inputNewCommentRef?.current?.focus({ preventScroll: true });
    inputNewCommentRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const renderComments = () => {
    return (
      <div className={css["comments"]}>
        <NewComment
          elementRef={inputNewCommentRef}
          handleNewComment={handleNewComment}
          postId={post.id}
        />
        {pagedComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {post.commentCount > pageInfo.pageSize && (
          <>
            {pageInfo.currentPage * pageInfo.pageSize < post.commentCount && (
              <div onClick={loadMoreComments} className={css["more-comment"]}>
                View more comments
              </div>
            )}
            <div onClick={focus} className={css["write-comment"]}>
              Write a comment...
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPostImage = () => {
    return (
      post.fileName && (
        <Spinner
          show={!postImage}
          sizeClass="size--840"
          fragment={<img className={css["post__image"]} src={postImage} />}
        />
      )
    );
  };

  const renderPostUserImage = () => {
    return (
      <Spinner
        show={!postUserImage}
        sizeClass="size--60"
        fragment={
          <img
            className={`${css["user-image"]} size--60`}
            src={postUserImage}
          />
        }
      />
    );
  };

  return (
    <>
      <div className={css.post}>
        <header className={css["header"]}>
          <div className={css["user"]}>
            <Link to={`/profile/${post.user.id}/posts`}>
              {renderPostUserImage()}
            </Link>
            <Link
              to={`/profile/${post.user.id}/posts`}
              className={css["user-name"]}
            >
              {post.user.fullName}
            </Link>
          </div>
          <p>{formatDate(post.dateCreated)}</p>
        </header>
        <p className={css["description"]}>{post.description}</p>
        {renderPostImage()}
        <footer className={css["footer"]}>
          <div className={css["details"]}>
            <span className={`${css["details-like"]} mx-2`}>
              {post.likeCount > 1
                ? `${post.likeCount} likes`
                : `${post.likeCount} like`}
            </span>
            <div>
              <span
                onClick={() => setShowComments(true)}
                className={`${css["details-comment"]} mx-2`}
              >
                {post.commentCount > 1
                  ? `${commentCount} Comments`
                  : `${commentCount} Comment`}
              </span>
              <span className={css["details-share"]}>10 Shares</span>
            </div>
          </div>
          <div className={css["action"]}>
            <div onClick={handleLike} className={css["icon"]}>
              <i
                className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              ></i>
              <span>Like</span>
            </div>
            <div
              onClick={() => {
                setShowComments(true);
                showComments && focus();
              }}
              className={css["icon"]}
            >
              <i className="fa-regular fa-comment"></i>
              <span>Comment</span>
            </div>
            <div className={css["icon"]}>
              <i className="fa-solid fa-share-from-square"></i>
              <span>Share</span>
            </div>
          </div>
          {showComments && renderComments()}
        </footer>
      </div>
    </>
  );
}

export default Post;
