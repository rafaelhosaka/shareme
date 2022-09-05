import httpService from "./httpService";
import FriendRequestEntity from "../models/friendRequest";
import UserProfileEntity, { UserProfileDTO } from "../models/userProfile";

const apiEndPoint = "/friend";

export function getRequestedUsers(requestingUserId: string) {
  return httpService.get(apiEndPoint + "/requested/" + requestingUserId);
}

export function getPendingFriendRequest(targetUserId: string) {
  return httpService.get(apiEndPoint + "/pending/" + targetUserId);
}

//return array/[0] = request/[1] = notification
export function createFriendRequest(friendRequest: FriendRequestEntity) {
  return httpService.post(apiEndPoint + "/createRequest", friendRequest);
}

export function deleteFriendRequest(friendRequest: FriendRequestEntity) {
  return httpService.delete(apiEndPoint + "/deleteRequest", {
    data: friendRequest,
  });
}

export function getFriendRequestFromIds(
  targetUserId: string,
  requestingUserId: string
) {
  return httpService.get(
    `${apiEndPoint}/getRequest?targetUserId=${targetUserId}&requestingUserId=${requestingUserId}`
  );
}

export async function isRequested(
  requestingUserId: string,
  targetUserId: string
) {
  const { data } = await httpService.get(
    `${apiEndPoint}/isRequested?requestingUserId=${requestingUserId}&targetUserId=${targetUserId}`
  );
  return data;
}

export async function isPending(
  requestingUserId: string,
  targetUserId: string
) {
  const { data } = await httpService.get(
    `${apiEndPoint}/isPending?requestingUserId=${requestingUserId}&targetUserId=${targetUserId}`
  );
  return data;
}

export async function acceptFriendRequest(friendRequest: FriendRequestEntity) {
  const { data: modifiedUsers } = await httpService.post(
    `${apiEndPoint}/acceptRequest`,
    friendRequest
  );
  return modifiedUsers; //[0] = requestingUser, [1] = targetUser
}

export async function unfriend(
  currentUser: UserProfileEntity,
  targetUser: UserProfileEntity
) {
  const formData = new FormData();
  formData.append("user1", JSON.stringify(new UserProfileDTO(currentUser)));
  formData.append("user2", JSON.stringify(new UserProfileDTO(targetUser)));
  const { data: modifiedUsers } = await httpService.put(
    `${apiEndPoint}/unfriend`,
    formData
  );

  return modifiedUsers; //[0] = currentUser, [1] = targetUser
}
