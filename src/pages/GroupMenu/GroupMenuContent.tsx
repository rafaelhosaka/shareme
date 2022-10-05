import { useParams } from "react-router";
import GroupForm from "../../components/Group/GroupForm";
import GroupPage from "../GroupPage/GroupPage";
import SearchGroup from "../SearchGroup/SearchGroup";

const GroupMenuContent = () => {
  const { option } = useParams();

  const renderResult = () => {
    switch (option) {
      case "feed":
        break;
      case "create":
        return (
          <div className="m2">
            <GroupForm />
          </div>
        );
      case "search":
        return (
          <div className="m2">
            <SearchGroup />
          </div>
        );
      default:
        return <GroupPage />;
    }
    return <></>;
  };

  return <>{renderResult()}</>;
};

export default GroupMenuContent;
