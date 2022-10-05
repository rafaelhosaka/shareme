import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAlert } from "../../components/Alert/Alert";
import Group from "../../components/Group/GroupList/Group";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import PostForm from "../../components/PostForm/PostForm";
import { GroupEntity } from "../../models/group";
import PostEntity from "../../models/post";
import { getGroupById } from "../../services/groupService";
import css from "./GroupPage.module.scss";

const GroupPage = () => {
  const { option } = useParams();
  const [group, setGroup] = useState<GroupEntity>();
  const [alert, dispatchAlert] = useAlert();
  const [loading, setLoading] = useState(true);

  async function getGroup() {
    if (option) {
      try {
        const { data } = await getGroupById(option);
        setGroup(data);
      } catch (ex: any) {
        if (ex.response.status === 400) {
          dispatchAlert("Sorry this group does not seem to exist", "warning");
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getGroup();
  }, [option]);

  const handleNewPost = (post: PostEntity) => {
    console.log(post);
  };

  const renderResult = () => {
    return (
      group && (
        <div className={css["container"]}>
          <Group group={group} />
          <PostForm handleNewPost={handleNewPost} />
        </div>
      )
    );
  };

  return (
    <>
      {alert}
      {loading ? (
        <div className="m2">
          <LoadingContainer labelSize="medium" />
        </div>
      ) : (
        renderResult()
      )}
    </>
  );
};

export default GroupPage;
