import { useUser } from "../../../context/userContext";
import FriendRequestEntity from "../../../models/friendRequest";
import {
  acceptFriendRequest,
  deleteFriendRequest,
} from "../../../services/friendService";
import { useAlert } from "../../Alert/Alert";
import FriendRequest from "./FriendRequest";
import css from "./FriendRequest.module.scss";
import UserProfileEntity from "../../../models/userProfile";
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
  const { setUser } = useUser();
  const [alert, dispatchAlert] = useAlert();
  const { sendNotification } = useStompContext();

  const handleDelete = (request: FriendRequestEntity) => {
    deleteFriendRequest(request);
    setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
  };

  const handleConfirm = async (request: FriendRequestEntity) => {
    if (setUser && sendNotification) {
      const returnData = await acceptFriendRequest(request);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));
      dispatchAlert(t("FRIENDS.alertFriendAccepted"), "success");
      setUser(new UserProfileEntity(returnData[1]));
      sendNotification(returnData[2]);
    }
  };

  return (
    <div className={css["friend-request-list__container"]}>
      {alert}
      <h2>{t("FRIENDS.friendRequests")}</h2>
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
