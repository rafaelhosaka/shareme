import UserProfileEntity from "./userProfile";

export interface MessageEntity {
  id: string;
  sender: UserProfileEntity;
  receiver: UserProfileEntity;
  content: string;
  dateSent: Date;
}
