import CommentEntity from "./comment";
import UserProfileEntity from "./userProfile";
import LikeEntity from "./like";

export class BasePostEntity {
  id: string;
  description: string;
  dateCreated: Date;
  user: UserProfileEntity;
  likes: LikeEntity[];
  comments: CommentEntity[];
  visibility: VisibilityEntity;

  constructor(data: BasePostEntity) {
    this.id = data.id;
    this.description = data.description;
    this.dateCreated = data.dateCreated;
    this.user = new UserProfileEntity(data.user);
    this.likes = data.likes;
    this.comments = data.comments;
    this.visibility = data.visibility;
  }
}

export default class PostEntity extends BasePostEntity {
  fileName: string;
  fileType: string;
  sharedUsersId: string[];

  constructor(data: PostEntity) {
    super(data);
    this.fileName = data.fileName;
    this.fileType = data.fileType;
    this.sharedUsersId = data.sharedUsersId;
  }
}

export class SharedPostEntity extends BasePostEntity {
  sharedPost: PostEntity;

  constructor(data: SharedPostEntity) {
    super(data);
    this.sharedPost = new PostEntity(data.sharedPost);
  }
}

export interface VisibilityEntity {
  type: string;
  allowedIds: string[];
}
