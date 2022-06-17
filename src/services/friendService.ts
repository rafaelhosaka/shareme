import httpService from "./httpService";
import FriendRequestEntity from "../models/friendRequest";

const apiEndPoint = "/friend";

export function getRequestedUsers(requestingUserId: string) {
  return httpService.get(apiEndPoint + "/requested/" + requestingUserId);
}

export function getPendingFriendRequest(targetUserId: string) {
  return httpService.get(apiEndPoint + "/pending/" + targetUserId);
}

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
  return modifiedUsers; //[0] requestingUser [1] targetUser
}
