import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/userContext";
import { useBase64File } from "../../../hook/useBase64File";
import { GroupEntity } from "../../../models/group";
import { downloadGroupImage, joinGroup } from "../../../services/groupService";
import css from "./GroupResult.module.scss";

interface GroupResultProps {
  group: GroupEntity;
  onUpdate: (group: GroupEntity) => void;
}

const GroupResult = ({ group, onUpdate }: GroupResultProps) => {
  const { t } = useTranslation();
  const {
    file: groupImage,
    executeRequest: downloadGroupImageExecute,
    cancelRequest: downloadGroupImageCancel,
  } = useBase64File(downloadGroupImage);
  const { user: currentUser } = useUser();

  useEffect(() => {
    downloadGroupImageExecute(group.id);

    return () => {
      downloadGroupImageCancel();
    };
  }, []);

  const checkJoined = () => {
    let joined = false;
    if (currentUser) {
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

  return (
    <div className={css["group__container"]}>
      <div className={css["group"]}>
        <Link to={`/group/${group.id}`}>
          <img className={css["image"]} src={groupImage} />
        </Link>
        <div>
          <Link to={`/group/${group.id}`}>
            <div className={css["name"]}>{group.name}</div>
          </Link>
          <span className={css["members"]}>
            {group.admins?.length + group.members?.length > 1
              ? t("GROUP.member_plural", {
                  count: group.admins?.length + group.members?.length,
                })
              : t("GROUP.member_singular", {
                  count: group.admins?.length + group.members?.length,
                })}
          </span>
        </div>
      </div>
      {checkJoined() ? (
        <Link to={`/group/${group.id}`}>
          <button className="btn btn--secondary">{t("GROUP.visit")}</button>
        </Link>
      ) : (
        <button onClick={handleJoin} className="btn btn--primary">
          {t("GROUP.join")}
        </button>
      )}
    </div>
  );
};

export default GroupResult;
