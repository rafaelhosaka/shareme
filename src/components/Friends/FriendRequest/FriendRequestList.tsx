import { useUser } from "../../../context/userContext";
import FriendRequestEntity from "../../../models/friendRequest";
import {
  acceptFriendRequest,
  deleteFriendRequest,
} from "../../../services/friendService";
import { useAlert } from "../../Alert/Alert";
import FriendRequest from "./FriendRequest";
import css from "./FriendRequest.module.scss";
import { useTranslation } from "react-i18next";
import { useStompContext } from "../../../context/stompContext";

interface FriendRequestListProps {
  friendRequests: FriendRequestEntity[];
  setFriendRequests: React.Dispatch<
    React.SetStateAction<FriendRequestEntity[]>
  >;
}

function FriendRequestList({
  friendRequests,
  setFriendRequests,
}: FriendRequestListProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [alert, dispatchAlert] = useAlert();
  const { sendNotification, sendNewFriend, sendRemovedRequest } =
    useStompContext();

  const handleDelete = (request: FriendRequestEntity) => {
    if (sendRemovedRequest) {
      deleteFriendRequest(request);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
      sendRemovedRequest(request);
    }
  };

  const handleConfirm = async (request: FriendRequestEntity) => {
    if (user && sendNotification && sendNewFriend) {
      const returnData = await acceptFriendRequest(request);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
      dispatchAlert(t("FRIENDS.alertFriendAccepted"), "success");
      sendNotification(returnData[2]);
      sendNewFriend({
        targetUserId: request.requestingUserId,
        friend: user,
      });
    }
  };

  return (
    <div className={css["friend-request-list__container"]}>
      {alert}
      <h2>{t("FRIENDS.friendRequests")}</h2>
      {friendRequests.length === 0 && (
        <div className={css["no-request"]}>{t("FRIENDS.noRequests")}</div>
      )}
      <div className={css["friend-requests"]}>
        {friendRequests.map((request) => (
          <FriendRequest
            key={request.id}
            request={request}
            handleDelete={handleDelete}
            handleConfirm={handleConfirm}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequestList;
