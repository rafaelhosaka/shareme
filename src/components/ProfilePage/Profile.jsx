import React, { useEffect, useState } from "react";
import "./Profile.css";
import {
  NavLink,
  Outlet,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  getUserById,
  userImageDownload,
  userImageUpload,
} from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import Spinner from "../Spinner/Spinner";
import { useUser } from "../../context/userContext";

function Profile(props) {
  const { id } = useParams();
  const [user, setUser] = useState();
  const { user: currentUser, setUser: setCurrentUser } = useUser();

  const { image: userImage, setService } = useBase64Image(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await getUserById(id);
        setUser(data);
        setService(userImageDownload(data.id));
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          navigate("/notfound");
        }
      }
    }
    getUser();
  }, [id]);

  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("userId", user.id);
    const { data } = await userImageUpload(formData);
    setUser(data);
    setService(userImageDownload(data.id));
    setCurrentUser(data);
  };

  return (
    <>
      <div className="profile__background"></div>
      <main className="container">
        <div className="background-image__container">
          <img
            className="background-image"
            src={process.env.PUBLIC_URL + "/images/bg.jpeg"}
          />
        </div>
        <div className="profile__header">
          <div className="profile-user">
            <Spinner
              show={!userImage}
              className="size--168"
              fragment={
                <>
                  <img
                    className="profile-user__image"
                    src={user && userImage}
                  />
                  {currentUser?.id === user?.id && (
                    <div className="change-icon__container">
                      <label htmlFor="upload-image">
                        <div className="change-icon">
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

            <div className="profile-user__details">
              <span className="profile-user__name">
                {user && `${user.firstName} ${user.lastName}`}
              </span>
              <Link to="/friends/all" className="profile-user__friends-qty">
                30 friends
              </Link>
            </div>
          </div>
        </div>
        <div className="profile-options__container">
          <NavLink to="posts" className="profile-option">
            Posts
          </NavLink>
          <NavLink to="images" className="profile-option">
            Images
          </NavLink>
          <NavLink to="videos" className="profile-option">
            Videos
          </NavLink>
        </div>
        <div>
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Profile;
