import { useParams } from "react-router";
import GroupForm from "../../components/Group/GroupForm";

const GroupMenuContent = () => {
  const { option } = useParams();

  const renderResult = () => {
    switch (option) {
      case "feed":
        break;
      case "create":
        return <GroupForm />;
      case "search":
        break;
    }

    return <></>;
  };

  return <>{renderResult()}</>;
};

export default GroupMenuContent;
