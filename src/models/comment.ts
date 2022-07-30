import LikeEntity from "./like";

export default interface CommentEntity {
  id?: string;
  userId: string;
  description: string;
  dateCreated?: Date;
  likes?: LikeEntity[];
  subComments?: CommentEntity[];
}
