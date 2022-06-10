import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { searchUsersContainsName } from "../../services/userService";
import PeopleResult from "./People/PeopleResult";
import {
  getPendingFriendRequest,
  getRequestedUsers,
} from "../../services/friendService";
import _ from "lodash";
import UserProfileEntity from "../../models/userProfile";
import css from "./Search.module.scss";
import { useUser } from "../../context/userContext";

function Search() {
  const { filter } = useParams();
  let [searchParams] = useSearchParams();
  let query = searchParams.get("q");
  const [result, setResult] = useState<UserProfileEntity[]>([]);
  const { user: currentUser } = useUser();

  const [requestedUsers, setRequestedUsers] = useState([]);
  const [pendingUsers, setPedingUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    if (!query) {
      navigate("/not-found", { replace: false });
    }
  }, []);

  useEffect(() => {
    async function filterResult() {
      switch (filter) {
        case "people":
          if (currentUser) {
            setResult(await getPeoples());
            const { data: requested } = await getRequestedUsers(
              currentUser?.id
            );
            setRequestedUsers(requested);
            const { data: pending } = await getPendingFriendRequest(
              currentUser?.id
            );
            setPedingUsers(pending);
          }
      }
    }
    filterResult();
  }, [filter, query]);

  const getPeoples = async () => {
    try {
      if (query) {
        const { data } = await searchUsersContainsName(query);
        return data;
      }
    } catch (ex: any) {
      if (ex.response?.status === 404) {
        return [];
      }
    }
  };

  const handleFilterSelected = (filterValue: string) => {
    setResult([]);
    navigate(`/search/${filterValue}?q=${query}`, { replace: false });
  };

  const isActive = (label: string) => {
    return label === filter ? "active" : "";
  };

  const renderResult = () => {
    if (result.length === 0) return <div>No result found</div>;
    switch (filter) {
      case "people":
        return renderPeople();
      default:
        return;
    }
  };

  const renderPeople = () => {
    return result.map((people) => (
      <PeopleResult
        key={people.id}
        people={new UserProfileEntity(people)}
        requested={_.some(requestedUsers, ["targetUserId", people.id])}
        pending={_.some(pendingUsers, ["requestingUserId", people.id])}
        ownSelf={people.id === currentUser?.id}
      />
    ));
  };

  return (
    <>
      <main className="container right center">{renderResult()}</main>
      <div className="left-content">
        <div className={css["search-menu__container"]}>
          <h1 className={css["search-menu__heading"]}>Search Results</h1>
          <span className={css["search-filter"]}>Filters</span>
          <div className={css["search-menu__list"]}>
            <div
              onClick={() => handleFilterSelected("people")}
              className={`${css["search-menu__item"]} ${
                css[isActive("people")]
              }`}
            >
              People
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
