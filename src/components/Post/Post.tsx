import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import useComponentVisible from "../../hook/useComponentVisible";
import CommentEntity from "../../models/comment";
import PostEntity, { SharedPostEntity } from "../../models/post";
import {
  deleteComment,
  newComment,
  replyComment,
} from "../../services/commentService";
import { likeUnlikePost } from "../../services/likeService";
import { postImageDownload } from "../../services/postService";
import { sharePost } from "../../services/shareService";
import { userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";
import { calculateMaxPage, paginate } from "../../utils/paginate";
import Comment from "../Comment/Comment";
import NewComment from "../Comment/NewComment";
import DropdownItem from "../DropdownMenu/DropdownItem";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Modal from "../Modal/Modal";
import Spinner from "../Spinner/Spinner";
import css from "./Post.module.scss";

interface PostProps {
  data: PostEntity | SharedPostEntity;
  onDelete: (postId: string) => void;
}

const Post = ({ data, onDelete }: PostProps) => {
  const [post, setPost] = useState(data);
  const { image: postImage, setService: setPostImageService } =
    useBase64Image(null);
  const { image: postUserImage, setService: setPostUserService } =
    useBase64Image(null);
  const { user: currentUser } = useUser();
  const inputNewCommentRef = useRef<HTMLTextAreaElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    refs: dropPostRefs,
    isComponentVisible: isDropPostVisible,
    setIsComponentVisible: setDropPostVisible,
  } = useComponentVisible(false);

  const [pagedComments, setPagedComments] = useState<CommentEntity[]>([]);
  const [commentCount, setCommentCount] = useState(
    post.comments.reduce(
      (result, comment) => result + (comment.subComments?.length ?? 0) + 1,
      0
    )
  );
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;
  const MAX_PAGE = calculateMaxPage(post.comments.length, PAGE_SIZE);

  useEffect(() => {
    setPostUserService(userImageDownload(post.user.id));
    setPostImageService(
      postImageDownload(
        post instanceof PostEntity ? post.id : post.sharedPost.id
      )
    );
  }, []);

  useEffect(() => {
    if (showComments) focusOnNewComment();
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

  const handleNewComment = async (comment: CommentEntity) => {
    const { data } = await newComment(JSON.stringify(comment), post.id);
    setPagedComments([data, ...pagedComments]);
    setCommentCount((prev) => prev + 1);
  };

  const handleReplyComment = async (
    newComment: CommentEntity,
    parentCommentId: string
  ) => {
    const { data } = await replyComment(
      JSON.stringify(newComment),
      parentCommentId
    );

    const index = pagedComments.findIndex((c) => data.id === c.id);
    const copy = [...pagedComments];
    copy[index] = data;

    setPagedComments(copy);
    setCommentCount((prev) => prev + 1);
  };

  const handleDeleteComment = (comment: CommentEntity) => {
    if (comment.id) {
      if (comment.parentId) {
        pagedComments.forEach((parent) => {
          parent.subComments = parent.subComments?.filter(
            (child) => child.id != comment.id
          );
        });
        setPagedComments(pagedComments);
      } else {
        setPagedComments((prev) => prev.filter((c) => c.id !== comment.id));
      }
      setCommentCount((prev) => prev - 1);
      deleteComment(comment.id, post.id);
    }
  };

  const handleSharePost = async () => {
    if (currentUser) {
      const { data } = await sharePost(currentUser.id, post.id);
      setPost(new PostEntity(data));
    }
  };

  const isLiked = post.likes.some((like) => {
    if (currentUser) return like.userId === currentUser.id;
    return;
  });

  const [liked, setLiked] = useState(isLiked);

  const focusOnNewComment = () => {
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
        />
        {pagedComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            replyComment={handleReplyComment}
          />
        ))}
        {post.commentCount > PAGE_SIZE && (
          <>
            {currentPage < MAX_PAGE && (
              <div onClick={loadMoreComments} className={css["more-comment"]}>
                View more comments
              </div>
            )}
            <div onClick={focusOnNewComment} className={css["write-comment"]}>
              Write a comment...
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPostImage = () => {
    const jsx = (
      <Spinner show={!postImage} sizeClass="size--840">
        <img className={css["post__image"]} src={postImage} />
      </Spinner>
    );
    if (post instanceof PostEntity) {
      return post.fileName ? jsx : <></>;
    } else {
      return post.sharedPost.fileName ? jsx : <></>;
    }
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
        <Modal
          show={showModal}
          title="Delete post?"
          description="Are you sure you want to delete this post?"
          onReject={() => setShowModal(false)}
          onAccept={() => {
            onDelete(post.id);
            setShowModal(false);
          }}
        />
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
          {currentUser?.id === post.user.id && (
            <div
              ref={(element) => (dropPostRefs.current[0] = element)}
              onClick={() => setDropPostVisible((prev) => !prev)}
              className={css["post-menu__container"]}
            >
              <i className={`${css["menu-icon"]} fa-solid fa-ellipsis`}></i>
              <div className={css["post-menu"]}>
                {isDropPostVisible && (
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => setShowModal(true)}
                      label="Delete post"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )}
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
            {post instanceof PostEntity && (
              <div>
                <span
                  onClick={() => setShowComments(true)}
                  className={`${css["details-comment"]} mx-2`}
                >
                  {post.commentCount > 1
                    ? `${commentCount} Comments`
                    : `${commentCount} Comment`}
                </span>
                <span className={css["details-share"]}>
                  {`${post.sharedCount} ${
                    post.sharedCount < 2 ? "Share" : "Shares"
                  }`}
                </span>
              </div>
            )}
          </div>
          <div className={css["action"]}>
            <div
              onClick={handleLikePost}
              className={
                liked ? `${css["liked"]} ${css["icon"]}` : `${css["icon"]}`
              }
            >
              <i
                className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              ></i>
              <span>Like</span>
            </div>
            <div
              onClick={() => {
                setShowComments(true);
                showComments && focusOnNewComment();
              }}
              className={css["icon"]}
            >
              <i className="fa-regular fa-comment"></i>
              <span>Comment</span>
            </div>
            <div onClick={handleSharePost} className={css["icon"]}>
              <i className="fa-solid fa-share-from-square"></i>
              <span>Share</span>
            </div>
          </div>
          {showComments && renderComments()}
        </footer>
      </div>
    </>
  );
};

export default Post;
