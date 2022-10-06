import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAlert } from "../../components/Alert/Alert";
import Group from "../../components/Group/GroupList/Group";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import PostList from "../../components/Post/PostList";
import PostForm from "../../components/PostForm/PostForm";
import { useUser } from "../../context/userContext";
import { GroupEntity } from "../../models/group";
import PostEntity from "../../models/post";
import { UserProfileDTO } from "../../models/userProfile";
import { getGroupById } from "../../services/groupService";
import {
  deletePost,
  getGroupPosts,
  savePost,
} from "../../services/postService";
import css from "./GroupPage.module.scss";

const GroupPage = () => {
  const { option } = useParams();
  const [group, setGroup] = useState<GroupEntity>();
  const [alert, dispatchAlert] = useAlert();
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<PostEntity[]>([]);

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

  async function getPosts() {
    if (group) {
      const { data } = await getGroupPosts(group.id);
      setPosts(data);
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
            <>
              <PostForm handleNewPost={handleNewPost} />
              <PostList posts={posts} onDelete={handleDeletePost} />
            </>
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
