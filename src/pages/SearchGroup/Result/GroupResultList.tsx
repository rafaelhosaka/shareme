import { GroupEntity } from "../../../models/group";
import GroupResult from "./GroupResult";
import css from "./GroupResult.module.scss";

interface GroupResultListProps {
  groups: GroupEntity[];
  onUpdate: (group: GroupEntity) => void;
}

const GroupResultList = ({ groups, onUpdate }: GroupResultListProps) => {
  return (
    <div className={css["group-list__container"]}>
      {groups.map((g) => (
        <GroupResult key={g.id} group={g} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default GroupResultList;
