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
import "./Post.css";
import Spinner from "../Spinner/Spinner";
import PostEntity from "../../models/post";
import CommentEntity from "../../models/comment";

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
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, pageSize: 5 });

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
    setPageInfo({
      currentPage: pageInfo.currentPage++,
      pageSize: pageInfo.pageSize,
    });
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
      <div className="post__comments">
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
              <div onClick={loadMoreComments} className="more-comment">
                View more comments
              </div>
            )}
            <div onClick={focus} className="write-comment">
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
          className="size--680"
          fragment={<img className="post__image" src={postImage} />}
        />
      )
    );
  };

  const renderPostUserImage = () => {
    return (
      <Spinner
        show={!postUserImage}
        className="size--60"
        fragment={
          <img className="post__user-image size--60" src={postUserImage} />
        }
      />
    );
  };

  return (
    <>
      <div className="post">
        <header className="post__header">
          <div className="post__user">
            <Link to={`/profile/${post.user.id}`}>{renderPostUserImage()}</Link>
            <Link
              to={`/profile/${post.user.id}/posts`}
              className="post__user-name"
            >
              {post.user.fullName}
            </Link>
          </div>
          <p className="post__date">{formatDate(post.dateCreated)}</p>
        </header>
        <p className="post__description">{post.description}</p>
        {renderPostImage()}
        <footer className="post__footer">
          <div className="post__details">
            <span className="post__details-like">
              {post.likeCount > 1
                ? `${post.likeCount} likes`
                : `${post.likeCount} like`}
            </span>
            <div>
              <span
                onClick={() => setShowComments(true)}
                className="post__details-comment"
              >
                {post.commentCount > 1
                  ? `${commentCount} Comments`
                  : `${commentCount} Comment`}
              </span>
              <span className="post__details-share">10 Shares</span>
            </div>
          </div>
          <div className="post__action">
            <div onClick={handleLike} className="post__icon">
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
              className="post__icon"
            >
              <i className="fa-regular fa-comment"></i>
              <span>Comment</span>
            </div>
            <div className="post__icon">
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
