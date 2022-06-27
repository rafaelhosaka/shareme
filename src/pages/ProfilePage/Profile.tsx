import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import UserProfileEntity from "../../models/userProfile";
import css from "./Profile.module.scss";
import ProfileContent from "./ProfileContent";
import ProfileCoverSection from "./ProfileCoverSection";
import ProfileUserSection from "./ProfileUserSection";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfileEntity>();

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
        const data = await getUserById(id);
        setUser(data);
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
          <div className={css["cover-image__container"]}>
            {user && <ProfileCoverSection user={user} setUser={setUser} />}
          </div>
          <div className={css["profile-user__container"]}>
            <div className={css["profile-user"]}>
              {user && <ProfileUserSection user={user} setUser={setUser} />}
            </div>
            <div className={css["profile-options__container"]}>
              {renderMenu()}
            </div>
          </div>
          {user && <ProfileContent user={user} />}
        </div>
      </main>
    </>
  );
}

export default Profile;
