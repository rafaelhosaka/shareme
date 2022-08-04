import CommentEntity from "./comment";
import UserProfileEntity from "./userProfile";
import LikeEntity from "./like";

class BasePostEntity {
  id: string;
  description: string;
  dateCreated: Date;
  user: UserProfileEntity;
  likes: LikeEntity[];
  comments: CommentEntity[];

  constructor(data: BasePostEntity) {
    this.id = data.id;
    this.description = data.description;
    this.dateCreated = data.dateCreated;
    this.user = new UserProfileEntity(data.user);
    this.likes = data.likes;
    this.comments = data.comments;
  }

  get likeCount(): number {
    return this.likes?.length ?? 0;
  }

  get commentCount(): number {
    return this.comments?.length ?? 0;
  }
}

export default class PostEntity extends BasePostEntity {
  fileName: string;
  sharedUsersId: string[];

  constructor(data: PostEntity) {
    super(data);
    this.fileName = data.fileName;
    this.sharedUsersId = data.sharedUsersId;
  }

  get sharedCount(): number {
    return this.sharedUsersId?.length ?? 0;
  }
}

export class SharedPostEntity extends BasePostEntity {
  sharedPost: PostEntity;

  constructor(data: SharedPostEntity) {
    super(data);
    this.sharedPost = data.sharedPost;
  }
}
