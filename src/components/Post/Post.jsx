import React, { useRef, useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import { postImageDownload } from "../../services/postService";
import { userImageDownload } from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import { useUser } from "../../context/UserContext";
import NewComment from "../Comment/NewComment";
import Comment from "../Comment/Comment";
import { likePost } from "../../services/likeService";
import { paginate } from "../../utils/paginate";

import "./Post.css";

function Post(props) {
  const [post, setPost] = useState(props.post);
  const { image: postImage } = useBase64Image(postImageDownload(post.id));
  const { image: postUserImage } = useBase64Image(
    userImageDownload(post.user.id)
  );
  const { user: currentUser } = useUser();
  const commentDivRef = useRef();
  const inputNewCommentRef = useRef();

  const [pagedComments, setPagedComments] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, pageSize: 5 });
  const MIN_COMMENT = 2;

  useEffect(() => {
    if (post.commentCount > MIN_COMMENT) {
      commentDivRef.current.className = "post__comments hidden";
    }
  }, []);

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
    setPageInfo({ currentPage: pageInfo.currentPage++, ...pageInfo });
  };

  const showComments = () => {
    commentDivRef.current.className = "post__comments";
  };

  const handleLike = async () => {
    const { data } = await likePost(currentUser.id, post.id);
    setPost(data);
    if (!liked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const handleNewComment = (comment) => {
    setPagedComments([comment, ...pagedComments]);
  };

  const isLiked = post.likes.some((like) => {
    return like.userId === currentUser.id;
  });

  const [liked, setLiked] = useState(isLiked);

  const focus = () => {
    inputNewCommentRef?.current.focus({ preventScroll: true });
    inputNewCommentRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return (
    <>
      <div className="post">
        <header className="post__header">
          <div className="post__user">
            <a href="/">
              <img className="post__user-image" src={postUserImage} />
            </a>
            <a href="/" className="post__user-name">
              {`${post.user.firstName} ${post.user.lastName}`}
            </a>
          </div>
          <p className="post__date">{formatDate(post.dateCreated)}</p>
        </header>
        <p className="post__description">{post.description}</p>
        {post.fileName && <img className="post__image" src={postImage} />}
        <footer className="post__footer">
          <div className="post__details">
            <span className="post__details-like">
              {post.likeCount > 1
                ? `${post.likeCount} likes`
                : `${post.likeCount} like`}
            </span>
            <div>
              <span onClick={showComments} className="post__details-comment">
                {post.commentCount > 1
                  ? `${post.commentCount} Comments`
                  : `${post.commentCount} Comment`}
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
                showComments();
                focus();
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
          <div className="post__comments" ref={commentDivRef}>
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
                {pageInfo.currentPage * pageInfo.pageSize <
                  post.commentCount && (
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
        </footer>
      </div>
    </>
  );
}

export default Post;
