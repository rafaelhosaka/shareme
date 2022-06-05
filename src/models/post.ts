import CommentEntity from "./comment";
import UserProfileEntity from "./userProfile";
import LikeEntity from "./like";

export default class PostEntity {
  id: string;
  description: string;
  dateCreated: Date;
  fileName: string;
  user: UserProfileEntity;
  likes: LikeEntity[];
  comments: CommentEntity[];

  constructor(data: PostEntity) {
    this.id = data.id;
    this.description = data.description;
    this.dateCreated = data.dateCreated;
    this.fileName = data.fileName;
    this.user = new UserProfileEntity(data.user);
    this.likes = data.likes;
    this.comments = data.comments;
  }

  get likeCount(): number {
    return this.likes.length;
  }

  get commentCount(): number {
    return this.comments.length;
  }
}
