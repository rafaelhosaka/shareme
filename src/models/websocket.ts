//models used only for websocket

import UserProfileEntity from "./userProfile";

export interface ChatStatusEntity {
  id: string;
  online: boolean;
  connected: boolean;
}

export interface FriendInformationEntity {
  targetUserId: string;
  friend: UserProfileEntity;
}
