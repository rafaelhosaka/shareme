import { useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { useBase64File } from "../../hook/useBase64File";
import UserProfileEntity from "../../models/userProfile";
import { userImageDownload } from "../../services/userService";
import { fullName } from "../../utils/formatedNames";
import css from "./Contact.module.scss";

interface ChatUserProps {
  user: UserProfileEntity;
}

const ContactUser = ({ user }: ChatUserProps) => {
  const {
    file: userImage,
    executeRequest: userImageDownloadExecute,
    cancelRequest: userImageDownloadCancel,
  } = useBase64File(userImageDownload);

  useEffect(() => {
    userImageDownloadExecute(user.id);

    return () => {
      userImageDownloadCancel();
    };
  }, []);

  return (
    <div className={css["user__container"]}>
      <div className={css["user-image__container"]}>
        <Spinner show={!userImage} sizeClass={"size--30"}>
          <>
            <img key={user.id} className={css["user-image"]} src={userImage} />
            {user.online && user.connected && (
              <div className={css["online"]}></div>
            )}
          </>
        </Spinner>
      </div>
      <span className={css["user-name"]}>{fullName(user)}</span>
    </div>
  );
};

export default ContactUser;
