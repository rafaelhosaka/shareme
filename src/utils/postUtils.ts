import _ from "lodash";
import PostEntity, { BasePostEntity, SharedPostEntity } from "./../models/post";

export function initPost(post: BasePostEntity) {
  if (_.has(post, "fileName")) {
    return (post = new PostEntity(post as PostEntity));
  } else {
    return (post = new SharedPostEntity(post as SharedPostEntity));
  }
}

export function initPosts(posts: BasePostEntity[]) {
  return posts.map((post) => {
    if (_.has(post, "fileName")) {
      return (post = new PostEntity(post as PostEntity));
    } else {
      return (post = new SharedPostEntity(post as SharedPostEntity));
    }
  });
}
