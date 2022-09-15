import { MessageEntity } from "./message";
import UserProfileEntity from "./userProfile";

export interface ChatEntity {
  id: string;
  owner: UserProfileEntity;
  friend: UserProfileEntity;
  lastMessage: MessageEntity;
  read: boolean;
}
