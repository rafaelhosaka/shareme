import Spinner from "../../components/Spinner/Spinner";
import UserProfileEntity from "../../models/userProfile";

import css from "./Profile.module.scss";
import { useEffect, useState } from "react";
import { useBase64Image } from "../../hook/useBase64Image";
import { userImageDownload, userImageUpload } from "../../services/userService";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import useComponentVisible from "../../hook/useComponentVisible";
import {
  acceptFriendRequest,
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequestFromIds,
  isPending,
  isRequested,
  unfriend,
} from "../../services/friendService";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import DropdownItem from "../../components/DropdownMenu/DropdownItem";
import { useTranslation } from "react-i18next";

interface ProfileUserSectionProps {
  user: UserProfileEntity;
  setUser: (user: UserProfileEntity) => void;
}

const ProfileUserSection = ({ user, setUser }: ProfileUserSectionProps) => {
  const { t } = useTranslation();
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  const { image: userImage, setService: setImageService } =
    useBase64Image(null);
  const [requested, setRequested] = useState(false);
  const [pending, setPending] = useState(false);

  const {
    refs: dropFriendRefs,
    isComponentVisible: isDropFriendVisible,
    setIsComponentVisible: setDropFriendVisible,
  } = useComponentVisible(false);

  useEffect(() => {
    async function initialize() {
      if (currentUser) {
        setImageService(userImageDownload(user.id));
        setRequested(await isRequested(currentUser.id, user.id));
        setPending(await isPending(user.id, currentUser.id));
      }
    }
    initialize();
  }, [user]);

  const handleCancelRequest = async () => {
    if (currentUser && user) {
      const { data } = await getFriendRequestFromIds(user.id, currentUser.id);
      deleteFriendRequest(data);
      setRequested(false);
    }
  };

  const handleAddFriend = async () => {
    if (currentUser && user) {
      await createFriendRequest({
        requestingUserId: currentUser.id,
        targetUserId: user.id,
      });
      setRequested(true);
    }
  };

  const handleConfirm = async () => {
    if (currentUser && setCurrentUser && user) {
      const { data } = await getFriendRequestFromIds(currentUser.id, user.id);
      const modifiedUsers = await acceptFriendRequest(data);
      setPending(false);
      setCurrentUser(new UserProfileEntity(modifiedUsers[1]));
      setUser(new UserProfileEntity(modifiedUsers[0]));
    }
  };

  const handleUnfriend = async () => {
    if (currentUser && user && setCurrentUser) {
      const modifieUsers = await unfriend(currentUser, user);
      setCurrentUser(new UserProfileEntity(modifieUsers[0]));
      setUser(new UserProfileEntity(modifieUsers[1]));
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    if (user) {
      const formData = new FormData();
      if (e.target instanceof HTMLInputElement)
        if (e?.target?.files && setCurrentUser) {
          formData.append("file", e.target.files[0]);
          formData.append("userId", user.id);
          const data = await userImageUpload(formData);
          setUser(data);
          setImageService(userImageDownload(data.id));
          setCurrentUser(data);
        }
    }
  };

  const renderButton = () => {
    if (currentUser?.id === user.id) return;
    if (user && currentUser?.friends.includes(user.id)) {
      return (
        <div
          ref={(element) => (dropFriendRefs.current[0] = element)}
          className={css["dropdown-friend-menu"]}
        >
          <button
            onClick={() => setDropFriendVisible((prev) => !prev)}
            className="btn btn--primary"
          >
            <i className="fa-solid fa-user-check"></i>Friend
          </button>
          {isDropFriendVisible && (
            <DropdownMenu>
              <DropdownItem onClick={() => handleUnfriend()} label="Unfriend">
                <i className="fa-solid fa-user-xmark"></i>
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>
      );
    }
    if (requested) {
      return (
        <button
          onClick={() => handleCancelRequest()}
          className="btn btn--primary"
        >
          {t("PROFILE.cancelRequest")}
        </button>
      );
    }
    if (pending) {
      return (
        <button onClick={() => handleConfirm()} className="btn btn--primary">
          {t("PROFILE.confirmRequest")}
        </button>
      );
    }

    return (
      <button onClick={() => handleAddFriend()} className="btn btn--primary">
        {t("PROFILE.addFriend")}
      </button>
    );
  };

  const renderUserImageSection = () => {
    return (
      <Spinner show={!userImage} sizeClass="size--168">
        <>
          <img className={css["profile-user__image"]} src={user && userImage} />
          {currentUser?.id === user?.id && (
            <div className={css["change-icon__container"]}>
              <label htmlFor="upload-image">
                <div className={css["change-icon"]}>
                  <i className="fa-solid fa-camera fa-xl"></i>
                </div>
                <input
                  id="upload-image"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    setImageService(null);
                    handleUploadImage(e);
                  }}
                />
              </label>
            </div>
          )}
        </>
      </Spinner>
    );
  };

  return (
    <>
      {renderUserImageSection()}
      <div className={css["profile-user__details"]}>
        <div className={css["profile-user__info"]}>
          <span className={css["profile-user__name"]}>{user?.fullName}</span>
          <Link
            to={`/profile/${user.id}/friends`}
            className={css["profile-user__friends-qty"]}
          >
            {user && user.friendCount <= 1
              ? t("PROFILE.friend_singular", { count: user.friendCount })
              : t("PROFILE.friend_plural", { count: user.friendCount })}
          </Link>
        </div>
        <div className={css["profile-user__buttons-area"]}>
          {renderButton()}
        </div>
      </div>
    </>
  );
};

export default ProfileUserSection;
