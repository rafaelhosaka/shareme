import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useAlert } from "../../components/Alert/Alert";
import Group from "../../components/Group/GroupList/Group";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import PostList from "../../components/Post/PostList";
import PostForm from "../../components/PostForm/PostForm";
import { useUser } from "../../context/userContext";
import { GroupEntity } from "../../models/group";
import PostEntity, { SharedPostEntity } from "../../models/post";
import { UserProfileDTO } from "../../models/userProfile";
import { getGroupById } from "../../services/groupService";
import {
  deletePost,
  getGroupPosts,
  savePost,
} from "../../services/postService";
import { initPosts } from "../../utils/postUtils";
import css from "./GroupPage.module.scss";

const GroupPage = () => {
  const { t } = useTranslation();
  const { option } = useParams();
  const [group, setGroup] = useState<GroupEntity>();
  const [alert, dispatchAlert] = useAlert();
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);

  async function getGroup() {
    if (option) {
      try {
        const { data } = await getGroupById(option);
        setGroup(data);
      } catch (ex: any) {
        if (ex.response.status === 400) {
          dispatchAlert(t("GROUP.alertGroupNotExist"), "warning");
        }
      }
    }
    setLoading(false);
  }

  async function getPosts() {
    if (group) {
      const { data } = await getGroupPosts(group.id);
      const posts = initPosts(data);
      setPosts(posts);
    }
  }

  useEffect(() => {
    setLoading(true);
    getGroup();
  }, [option]);

  useEffect(() => {
    getPosts();
  }, [group]);

  const handleNewPost = async (description: string, file: File) => {
    if (currentUser && group) {
      const post = await savePost(
        JSON.stringify({
          user: new UserProfileDTO(currentUser),
          description,
          visibility: { type: "group", allowedIds: [group.id] },
        }),
        file
      );
      setPosts((prev) => [post, ...prev]);
    }
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleUpdate = (group: GroupEntity) => {
    setGroup(group);
  };

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

  const renderResult = () => {
    return (
      group && (
        <div className={css["container"]}>
          <Group group={group} onUpdate={handleUpdate} />
          {checkJoined() && (
            <div className={css["feed"]}>
              <PostForm handleNewPost={handleNewPost} />
              <PostList posts={posts} onDelete={handleDeletePost} />
            </div>
          )}
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
