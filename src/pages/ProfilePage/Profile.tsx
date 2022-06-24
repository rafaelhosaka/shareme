import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
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
} from "../../services/friendService";
import UserProfileEntity from "../../models/userProfile";
import css from "./Profile.module.scss";
import _ from "lodash";
import ProfileContent from "./ProfileContent";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import { useToggle } from "../../hook/useToggle";
import DropdownItem from "../../components/DropdownMenu/DropdownItem";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfileEntity>();
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  const [showDropdownMenu, toggleDropdownMenu] = useToggle(false);

  const [requested, setRequested] = useState(false);
  const [pending, setPending] = useState(false);

  const { image: userImage, setService } = useBase64Image(null);

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
          setService(userImageDownload(data.id));
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
          setService(userImageDownload(data.id));
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

  const handleUnfriend = () => {
    console.log("unfriend");
  };

  const renderButton = () => {
    if (currentUser?.id === id) return;
    if (user && currentUser?.friends.includes(user.id)) {
      return (
        <div className={css["dropdown-menu"]}>
          <button onClick={toggleDropdownMenu} className="btn btn--primary">
            <i className="fa-solid fa-user-check"></i>Friend
          </button>
          {showDropdownMenu && (
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

  return (
    <>
      <div className={css["profile__background"]}></div>
      <main className="container full">
        <div className={css["profile__container"]}>
          <div className={css["background-image__container"]}>
            <img
              className={css["background-image"]}
              src={process.env.PUBLIC_URL + "/images/bg.jpeg"}
            />
          </div>
          <div className={css["profile__header"]}>
            <div className={css["profile-user"]}>
              <Spinner
                show={!userImage}
                sizeClass="size--168"
                fragment={
                  <>
                    <img
                      className={css["profile-user__image"]}
                      src={user && userImage}
                    />
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
                              setService(null);
                              handleUploadImage(e);
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </>
                }
              />

              <div className={css["profile-user__details"]}>
                <div className={css["profile-user__info"]}>
                  <span className={css["profile-user__name"]}>
                    {user?.fullName}
                  </span>
                  <Link
                    to="friends"
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
