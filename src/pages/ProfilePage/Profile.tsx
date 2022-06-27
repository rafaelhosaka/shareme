import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  userCoverImageDownload,
  userCoverImageUpload,
  userImageDownload,
  userImageUpload,
} from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import Spinner from "../../components/Spinner/Spinner";
import { useUser } from "../../context/userContext";
import {
  acceptFriendRequest,
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequestFromIds,
  isPending,
  isRequested,
  unfriend,
} from "../../services/friendService";
import UserProfileEntity from "../../models/userProfile";
import css from "./Profile.module.scss";
import ProfileContent from "./ProfileContent";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import DropdownItem from "../../components/DropdownMenu/DropdownItem";
import useComponentVisible from "../../hook/useComponentVisible";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfileEntity>();
  const { user: currentUser, setUser: setCurrentUser } = useUser();

  const {
    refs: dropFriendRefs,
    isComponentVisible: isDropFriendVisible,
    setIsComponentVisible: setDropFriendVisible,
  } = useComponentVisible(false);

  const {
    refs: dropCoverRefs,
    isComponentVisible: isDropCoverVisible,
    setIsComponentVisible: setDropCoverVisible,
  } = useComponentVisible(false);

  const [requested, setRequested] = useState(false);
  const [pending, setPending] = useState(false);

  const { image: userImage, setService: setImageService } =
    useBase64Image(null);
  const { image: userCoverImage, setService: setCoverImageService } =
    useBase64Image(null);

  const menu = [
    { key: "posts", value: "Posts" },
    { key: "friends", value: "Friends" },
    { key: "photos", value: "Photos" },
    { key: "videos", value: "Videos" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    async function getUser(id: string) {
      try {
        if (currentUser) {
          const data = await getUserById(id);
          setUser(data);
          setImageService(userImageDownload(data.id));
          setCoverImageService(userCoverImageDownload(data.id));
          setRequested(await isRequested(currentUser.id, id));
          setPending(await isPending(id, currentUser.id));
        }
      } catch (ex: any) {
        if (ex.response && ex.response.status === 404) {
          navigate("/notfound");
        }
      }
    }
    if (id) {
      getUser(id);
    }
  }, [id]);

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

  const handleUploadCoverImage = async (e: React.FormEvent) => {
    console.log(e);

    if (user) {
      const formData = new FormData();
      if (e.target instanceof HTMLInputElement)
        if (e?.target?.files && setCurrentUser) {
          formData.append("file", e.target.files[0]);
          formData.append("userId", user.id);
          const data = await userCoverImageUpload(formData);
          setUser(data);
          setCoverImageService(userCoverImageDownload(data.id));
          setCurrentUser(data);
        }
    }
  };

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

  const renderButton = () => {
    if (currentUser?.id === id) return;
    if (user && currentUser?.friends.includes(user.id)) {
      return (
        <div className={css["dropdown-friend-menu"]}>
          <button
            ref={(element) => (dropFriendRefs.current[0] = element)}
            onClick={() => setDropFriendVisible((prev) => !prev)}
            className="btn btn--primary"
          >
            <i className="fa-solid fa-user-check"></i>Friend
          </button>
          {isDropFriendVisible && (
            <DropdownMenu>
              <DropdownItem onClick={handleUnfriend} label="Unfriend">
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
          Cancel request
        </button>
      );
    }
    if (pending) {
      return (
        <button onClick={() => handleConfirm()} className="btn btn--primary">
          Confirm request
        </button>
      );
    }

    return (
      <button onClick={() => handleAddFriend()} className="btn btn--primary">
        Add Friend
      </button>
    );
  };

  const renderMenu = () => {
    return menu.map((option) => {
      return (
        <NavLink
          key={option.key}
          to={`/profile/${id}/${option.key}`}
          className={({ isActive }) =>
            isActive
              ? `${css["profile-option"]} ${css["active"]}`
              : css["profile-option"]
          }
        >
          {option.value}
        </NavLink>
      );
    });
  };

  const renderEditCoverButton = () => {
    if (currentUser?.id !== id) return;

    return (
      <div className={css["edit-bg__container"]}>
        <button
          ref={(element) => (dropCoverRefs.current[0] = element)}
          onClick={() => setDropCoverVisible((prev) => !prev)}
          className="btn btn--primary"
        >
          <i className="fa-solid fa-camera"></i>Edit cover photo
        </button>
        {isDropCoverVisible && (
          <DropdownMenu>
            <label
              ref={(element) => (dropCoverRefs.current[1] = element)}
              htmlFor="upload-cover-image"
            >
              <DropdownItem label="Upload Photo">
                <i className="fa-solid fa-file-arrow-up"></i>
              </DropdownItem>
              <input
                id="upload-cover-image"
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  setCoverImageService(null);
                  handleUploadCoverImage(e);
                  setDropCoverVisible(false);
                }}
              />
            </label>
          </DropdownMenu>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={css["profile__background"]}></div>
      <main className="container full">
        <div className={css["profile__container"]}>
          <div className={css["cover-image__container"]}>
            <div className={css["cover-image"]}>
              <Spinner show={!userCoverImage} sizeClass="size--400">
                {user?.coverFileName ? (
                  <img className={css["cover-image"]} src={userCoverImage} />
                ) : (
                  <div className={css["cover-image"]} />
                )}
              </Spinner>
            </div>
            {renderEditCoverButton()}
          </div>
          <div className={css["profile__header"]}>
            <div className={css["profile-user"]}>
              {renderUserImageSection()}
              <div className={css["profile-user__details"]}>
                <div className={css["profile-user__info"]}>
                  <span className={css["profile-user__name"]}>
                    {user?.fullName}
                  </span>
                  <Link
                    to={`/profile/${id}/friends`}
                    className={css["profile-user__friends-qty"]}
                  >
                    {user && user.friendCount <= 1
                      ? `${user?.friendCount} friend`
                      : `${user?.friendCount} friends`}
                  </Link>
                </div>
                <div className={css["profile-user__buttons-area"]}>
                  {renderButton()}
                </div>
              </div>
            </div>
            <div className={css["profile-options__container"]}>
              {renderMenu()}
            </div>
          </div>
          <ProfileContent />
        </div>
      </main>
    </>
  );
}

export default Profile;
