import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../context/userContext";
import { useBase64File } from "../../../hook/useBase64File";
import useComponentVisible from "../../../hook/useComponentVisible";
import { GroupEntity } from "../../../models/group";
import {
  downloadGroupImage,
  groupCoverImageUpload,
  joinGroup,
} from "../../../services/groupService";
import DropdownItem from "../../DropdownMenu/DropdownItem";
import DropdownMenu from "../../DropdownMenu/DropdownMenu";
import Spinner from "../../Spinner/Spinner";
import css from "./Group.module.scss";

interface GroupProps {
  group: GroupEntity;
  onUpdate: (group: GroupEntity) => void;
}

const Group = ({ group, onUpdate }: GroupProps) => {
  const { t } = useTranslation();
  const { file: groupImage, setService } = useBase64File(null);
  const { user: currentUser } = useUser();

  const {
    refs: dropCoverRefs,
    isComponentVisible: isDropCoverVisible,
    setIsComponentVisible: setDropCoverVisible,
  } = useComponentVisible(false);

  useEffect(() => {
    setService(downloadGroupImage(group.id));
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

  const handleUploadCoverImage = async (e: React.FormEvent) => {
    if (e.target instanceof HTMLInputElement && group)
      if (e?.target?.files) {
        const { data } = await groupCoverImageUpload(
          group.id,
          e.target.files[0]
        );
        setService(downloadGroupImage(data.id));
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
                  setService(null);
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
            <button className="btn btn--primary">{t("GROUP.joined")}</button>
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
