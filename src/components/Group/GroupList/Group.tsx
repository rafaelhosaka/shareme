import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/userContext";
import { useBase64File } from "../../../hook/useBase64File";
import useComponentVisible from "../../../hook/useComponentVisible";
import { GroupEntity } from "../../../models/group";
import {
  downloadGroupImage,
  groupCoverImageUpload,
  joinGroup,
  leaveGroup,
} from "../../../services/groupService";
import DropdownItem from "../../DropdownMenu/DropdownItem";
import DropdownMenu from "../../DropdownMenu/DropdownMenu";
import Modal from "../../Modal/Modal";
import Spinner from "../../Spinner/Spinner";
import css from "./Group.module.scss";

interface GroupProps {
  group: GroupEntity;
  onUpdate: (group: GroupEntity) => void;
}

const Group = ({ group, onUpdate }: GroupProps) => {
  const { t } = useTranslation();
  const {
    file: groupImage,
    executeRequest: downloadGroupImageExecute,
    cancelRequest: downloadGroupImageCancel,
    clearImage: downloadGroupImageClear,
  } = useBase64File(downloadGroupImage);
  const { user: currentUser } = useUser();

  const {
    refs: dropCoverRefs,
    isComponentVisible: isDropCoverVisible,
    setIsComponentVisible: setDropCoverVisible,
  } = useComponentVisible(false);
  const {
    refs: dropJoinedRefs,
    isComponentVisible: isDropJoinedVisible,
    setIsComponentVisible: setDropJoinedVisible,
  } = useComponentVisible(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    downloadGroupImageExecute(group.id);

    return () => {
      downloadGroupImageCancel();
    };
  }, []);

  const checkJoined = () => {
    let joined = false;
    if (currentUser && group) {
      if (group.admins.includes(currentUser.id)) {
        joined = true;
      }
      if (group.members.includes(currentUser.id)) {
        joined = true;
      }
    }
    return joined;
  };

  const handleJoin = async () => {
    if (currentUser) {
      const { data } = await joinGroup(group.id, currentUser.id);
      onUpdate(data);
    }
  };

  const handleLeave = async () => {
    if (currentUser) {
      const { data } = await leaveGroup(group.id, currentUser.id);
      onUpdate(data);
    }
  };

  const handleUploadCoverImage = async (e: React.FormEvent) => {
    if (e.target instanceof HTMLInputElement && group)
      if (e?.target?.files) {
        const { data } = await groupCoverImageUpload(
          group.id,
          e.target.files[0]
        );
        downloadGroupImageExecute(data.id);
        onUpdate(data);
      }
  };

  const renderEditCoverButton = () => {
    if (currentUser && !group?.admins.includes(currentUser?.id)) return;

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
          {t("GROUP.editCoverPhoto")}
        </button>
        {isDropCoverVisible && (
          <DropdownMenu>
            <label htmlFor="upload-cover-image">
              <DropdownItem label={t("GROUP.uploadPhoto")}>
                <i className="fa-solid fa-file-arrow-up"></i>
              </DropdownItem>
              <input
                id="upload-cover-image"
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  downloadGroupImageClear();
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

  const render = () => {
    return (
      <div className={css["container"]}>
        <Modal
          show={showLeaveModal}
          title={`${t("GROUP.modalLeaveTitle")}`}
          description={t("GROUP.modalLeaveDescription")}
          onReject={() => setShowLeaveModal(false)}
          onAccept={() => {
            handleLeave();
            setShowLeaveModal(false);
          }}
        />
        <div className={css["cover__container"]}>
          <Spinner show={!groupImage} sizeClass="size--300">
            {group?.coverFileName ? (
              <img className={css["cover"]} src={groupImage} />
            ) : (
              <div className={css["cover"]} />
            )}
          </Spinner>
          {renderEditCoverButton()}
        </div>

        <div className={css["body"]}>
          <div>
            <div className={css["name"]}>{group?.name}</div>
            <div className={css["member"]}>
              {group.admins?.length + group.members?.length > 1
                ? t("GROUP.member_plural", {
                    count: group.admins?.length + group.members?.length,
                  })
                : t("GROUP.member_singular", {
                    count: group.admins?.length + group.members?.length,
                  })}
            </div>
          </div>
          {checkJoined() ? (
            <div ref={(element) => (dropJoinedRefs.current[0] = element)}>
              <button
                onClick={() => setDropJoinedVisible(true)}
                className="btn btn--secondary"
              >
                {t("GROUP.joined")}
              </button>
              {isDropJoinedVisible && (
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => setShowLeaveModal(true)}
                    label={t("GROUP.leave")}
                  >
                    <i className="fa-solid fa-door-open"></i>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </div>
          ) : (
            <button onClick={handleJoin} className="btn btn--primary">
              {t("GROUP.join")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return <>{render()}</>;
};

export default Group;
