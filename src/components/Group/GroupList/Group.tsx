import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useBase64File } from "../../../hook/useBase64File";
import { GroupEntity } from "../../../models/group";
import { downloadGroupImage } from "../../../services/groupService";
import css from "./Group.module.scss";

interface GroupProps {
  group: GroupEntity;
}

const Group = ({ group }: GroupProps) => {
  const { t } = useTranslation();
  const { file: groupImage, setService } = useBase64File(null);

  useEffect(() => {
    setService(downloadGroupImage(group.id));
  }, []);

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
      <button className="btn btn--primary">{t("GROUP.join")}</button>
    </div>
  );
};

export default Group;
