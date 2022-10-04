import { useParams } from "react-router";
import GroupForm from "../../components/Group/GroupForm";
import SearchGroup from "../SearchGroup/SearchGroup";

const GroupMenuContent = () => {
  const { option } = useParams();

  const renderResult = () => {
    switch (option) {
      case "feed":
        break;
      case "create":
        return <GroupForm />;
      case "search":
        return <SearchGroup />;
    }

    return <></>;
  };

  return <>{renderResult()}</>;
};

export default GroupMenuContent;
