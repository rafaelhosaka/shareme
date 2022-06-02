import httpService from "./httpService";

const apiEndPoint = "/friend";

export function getRequestedUsers(requestingUserId) {
  return httpService.get(apiEndPoint + "/requested/" + requestingUserId);
}

export function getPendingFriendRequest(targetUserId) {
  return httpService.get(apiEndPoint + "/pending/" + targetUserId);
}

export function createFriendRequest(friendRequest) {
  return httpService.post(apiEndPoint + "/createRequest", friendRequest);
}

export function deleteFriendRequest(friendRequest) {
  return httpService.delete(apiEndPoint + "/deleteRequest", {
    data: friendRequest,
  });
}

export function getFriendRequestFromIds(targetUserId, requestingUserId) {
  return httpService.get(
    apiEndPoint +
      `/getRequest?targetUserId=${targetUserId}&requestingUserId=${requestingUserId}`
  );
}
