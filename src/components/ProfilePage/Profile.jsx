import React, { useState } from "react";
import "./Profile.css";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { userImageUpload } from "../../services/userService";

function Profile(props) {
  const { user: currentUser, setUser } = useUser();
  const userImage = useUserImage();

  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("userId", currentUser.id);
    const { data } = await userImageUpload(formData);
    setUser(data);
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
            <img
              className="profile-user__image"
              src={currentUser && userImage}
            />
            <div className="change-icon__container">
              <label htmlFor="upload-image">
                <div className="change-icon">
                  <i className="fa-solid fa-camera fa-xl"></i>
                </div>
                <input
                  id="upload-image"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => handleUploadImage(e)}
                />
              </label>
            </div>
            <div className="profile-user__details">
              <span className="profile-user__name">
                {currentUser &&
                  `${currentUser.firstName} ${currentUser.lastName}`}
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
