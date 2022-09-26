import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostEntity, { SharedPostEntity } from "../../models/post";
import UserProfileEntity from "../../models/userProfile";
import { getPostsByUsersId } from "../../services/postService";
import { getUsersFromIds } from "../../services/userService";
import FriendList from "../../components/Friends/FriendList/FriendList";
import PostList from "../../components/Post/PostList";
import css from "./Profile.module.scss";
import PhotoList from "../../components/Photo/PhotoList";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";

interface ProfileContentProps {
  user: UserProfileEntity;
}

const ProfileContent = ({ user }: ProfileContentProps) => {
  const { option } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<(PostEntity | SharedPostEntity)[]>([]);
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);
  const [postPhotos, setPostPhotos] = useState<PostEntity[]>([]);

  async function getPosts() {
    const posts = await getPostsByUsersId([user.id]);

    setPosts(posts);
    setLoading(false);
  }

  async function getFriends() {
    const data = await getUsersFromIds(user.friends);
    setFriends(data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    switch (option) {
      case "posts":
        getPosts();
        break;
      case "friends":
        getFriends();
        break;
      case "photos":
        getPostPhotos();
        break;
      default:
        setLoading(false);
    }
  }, [option]);

  const getPostPhotos = async () => {
    let myPosts: PostEntity[] = [];
    let posts = await getPostsByUsersId([user.id]);
    posts.forEach((post) => {
      if (post instanceof PostEntity) {
        myPosts.push(post);
      }
    });
    setPostPhotos(myPosts);
    setLoading(false);
  };

  const renderResult = () => {
    switch (option) {
      case "posts":
        return <PostList posts={posts} />;
      case "friends":
        return <FriendList friends={friends} />;
      case "photos":
        return <PhotoList items={postPhotos} />;
    }
    return <></>;
  };

  return (
    <>
      {loading ? (
        <div className="m2">
          <LoadingContainer />
        </div>
      ) : (
        <div className={`${css["profile-content-container"]}`}>
          {renderResult()}
        </div>
      )}
    </>
  );
};

export default ProfileContent;
