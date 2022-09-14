import { MessageEntity } from "./message";
import UserProfileEntity from "./userProfile";

export interface ChatEntity {
  id: string;
  firstUser: UserProfileEntity;
  secondUser: UserProfileEntity;
  lastMessage: MessageEntity;
}
