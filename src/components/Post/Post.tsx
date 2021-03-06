import { useRef, useState, useEffect } from "react";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";
import { postImageDownload } from "../../services/postService";
import { userImageDownload } from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import { useUser } from "../../context/userContext";
import NewComment from "../Comment/NewComment";
import Comment from "../Comment/Comment";
import { likeUnlikePost } from "../../services/likeService";
import { calculateMaxPage, paginate } from "../../utils/paginate";
import { Link } from "react-router-dom";

import Spinner from "../Spinner/Spinner";
import PostEntity from "../../models/post";
import CommentEntity from "../../models/comment";

import css from "./Post.module.scss";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import DropdownItem from "../DropdownMenu/DropdownItem";
import useComponentVisible from "../../hook/useComponentVisible";

interface PostProps {
  post: PostEntity;
  onDelete: (post: PostEntity) => void;
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

  const {
    refs: dropPostRefs,
    isComponentVisible: isDropPostVisible,
    setIsComponentVisible: setDropPostVisible,
  } = useComponentVisible(false);

  const [pagedComments, setPagedComments] = useState<CommentEntity[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;
  const MAX_PAGE = calculateMaxPage(post.comments.length, PAGE_SIZE);

  useEffect(() => {
    setPostUserService(userImageDownload(post.user.id));
    setPostImageService(postImageDownload(post.id));
  }, []);

  useEffect(() => {
    if (showComments) focus();
  }, [showComments]);

  useEffect(() => {
    const paged = paginate(post.comments, currentPage, PAGE_SIZE);
    const concatPages = [...pagedComments, ...paged];
    setPagedComments(concatPages);
  }, [currentPage]);

  const loadMoreComments = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleLikePost = async () => {
    if (currentUser) {
      const { data } = await likeUnlikePost(currentUser.id, post.id);
      setPost(new PostEntity(data));
      setLiked((prev) => !prev);
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
        {post.commentCount > PAGE_SIZE && (
          <>
            {currentPage < MAX_PAGE && (
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
        <Spinner show={!postImage} sizeClass="size--840">
          <img className={css["post__image"]} src={postImage} />
        </Spinner>
      )
    );
  };

  const renderPostUserImage = () => {
    return (
      <Spinner show={!postUserImage} sizeClass="size--60">
        <img className={`${css["user-image"]} size--60`} src={postUserImage} />
      </Spinner>
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
            <div>
              <Link
                to={`/profile/${post.user.id}/posts`}
                className={css["user-name"]}
              >
                {post.user.fullName}
              </Link>
              <p className={css["post__past-time"]}>
                {pastTimeFromDate(post.dateCreated).endsWith("y")
                  ? formatDate(post.dateCreated, {
                      month: "long",
                      day: "numeric",
                    })
                  : pastTimeFromDate(post.dateCreated)}
                <span className={css["post-date"]}>
                  {formatDate(post.dateCreated)}
                </span>
              </p>
            </div>
          </div>
          <div
            ref={(element) => (dropPostRefs.current[0] = element)}
            onClick={() => setDropPostVisible((prev) => !prev)}
            className={css["post-menu__container"]}
          >
            <i className="fa-solid fa-ellipsis"></i>
            <div className={css["post-menu"]}>
              {isDropPostVisible && (
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => props.onDelete(post)}
                    label="Delete post"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </div>
          </div>
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
            <div onClick={handleLikePost} className={css["icon"]}>
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
