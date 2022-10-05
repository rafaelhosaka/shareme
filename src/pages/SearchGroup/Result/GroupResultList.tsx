import { GroupEntity } from "../../../models/group";
import GroupResult from "./GroupResult";
import css from "./GroupResult.module.scss";

interface GroupResultListProps {
  groups: GroupEntity[];
}

const GroupResultList = ({ groups }: GroupResultListProps) => {
  return (
    <div className={css["group-list__container"]}>
      {groups.map((g) => (
        <GroupResult key={g.id} group={g} />
      ))}
    </div>
  );
};

export default GroupResultList;
