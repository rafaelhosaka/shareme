import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../../hook/useBase64Image";
import { userImageDownload } from "../../../services/userService";
import "./PeopleResult.css";

function PeopleResult({ data }) {
  const { image: userImage, setService } = useBase64Image(null);

  useEffect(() => {
    setService(userImageDownload(data.id));
  }, []);

  return (
    <div className="people__container">
      <div className="people__info">
        <Link to={`/profile/${data.id}`}>
          <img className="people__user-image" src={userImage} />
        </Link>
        <Link to={`/profile/${data.id}`} className="people__name">
          {data.firstName} {data.lastName}
        </Link>
      </div>
      <button className="btn">
        <span className="people__add-friend">Add Friend</span>
      </button>
    </div>
  );
}

export default PeopleResult;
