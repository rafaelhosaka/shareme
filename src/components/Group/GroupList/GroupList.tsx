import { GroupEntity } from "../../../models/group";
import Group from "./Group";
import css from "./Group.module.scss";

interface GroupListProps {
  groups: GroupEntity[];
}

const GroupList = ({ groups }: GroupListProps) => {
  return (
    <div className={css["group-list__container"]}>
      {groups.map((g) => (
        <Group key={g.id} group={g} />
      ))}
    </div>
  );
};

export default GroupList;
