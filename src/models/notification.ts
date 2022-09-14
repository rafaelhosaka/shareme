import UserProfileEntity from "./userProfile";

export class NotificationEntity {
  id: string;
  read: boolean;
  ownerUserId: string;
  dateCreated: Date;

  constructor(data: NotificationEntity) {
    this.id = data.id;
    this.read = data.read;
    this.dateCreated = data.dateCreated;
    this.ownerUserId = data.ownerUserId;
  }
}

export default class FriendRequestNotificationEntity extends NotificationEntity {
  friendRequesting: UserProfileEntity;

  constructor(data: FriendRequestNotificationEntity) {
    super(data);
    this.friendRequesting = data.friendRequesting;
  }
}
