import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import Spinner from "../../components/Spinner/Spinner";
import DropdownItem from "../../components/DropdownMenu/DropdownItem";
import useComponentVisible from "../../hook/useComponentVisible";
import { useBase64File } from "../../hook/useBase64File";

import css from "./Profile.module.scss";
import UserProfileEntity from "../../models/userProfile";
import { useEffect } from "react";
import {
  userCoverImageDownload,
  userCoverImageUpload,
} from "../../services/userService";
import { useUser } from "../../context/userContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

interface ProfileCoverSectionProps {
  user: UserProfileEntity;
  setUser: (user: UserProfileEntity) => void;
}

const ProfileCoverSection = ({ user, setUser }: ProfileCoverSectionProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  const { file: userCoverImage, setService: setCoverImageService } =
    useBase64File(null);

  const {
    refs: dropCoverRefs,
    isComponentVisible: isDropCoverVisible,
    setIsComponentVisible: setDropCoverVisible,
  } = useComponentVisible(false);

  useEffect(() => {
    setCoverImageService(null);
  }, [id]);

  useEffect(() => {
    setCoverImageService(userCoverImageDownload(user.id));
  }, [user]);

  const handleUploadCoverImage = async (e: React.FormEvent) => {
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

  const renderEditCoverButton = () => {
    if (currentUser?.id !== user.id) return;

    return (
      <div
        ref={(element) => (dropCoverRefs.current[0] = element)}
        className={css["edit-bg__container"]}
      >
        <button
          onClick={() => setDropCoverVisible((prev) => !prev)}
          className="btn btn--primary"
        >
          <i className="fa-solid fa-camera"></i>
          {t("PROFILE.editCoverPhoto")}
        </button>
        {isDropCoverVisible && (
          <DropdownMenu>
            <label className={css["upload-label"]} htmlFor="upload-cover-image">
              <DropdownItem label={t("PROFILE.uploadPhoto")}>
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
      <div className={css["cover-image"]}>
        <Spinner show={!userCoverImage} sizeClass="size--200">
          {user?.coverFileName ? (
            <img className={css["cover-image"]} src={userCoverImage} />
          ) : (
            <div className={css["cover-image"]} />
          )}
        </Spinner>
      </div>
      {renderEditCoverButton()}
    </>
  );
};

export default ProfileCoverSection;
