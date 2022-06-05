import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { searchUsersContainsName } from "../../services/userService";
import "./Search.css";
import PeopleResult from "./People/PeopleResult";
import {
  getPendingFriendRequest,
  getRequestedUsers,
} from "../../services/friendService";
import _ from "lodash";
import UserProfileEntity from "../../models/userProfile";

interface SearchProps {
  currentUser: UserProfileEntity;
}

function Search({ currentUser }: SearchProps) {
  const { filter } = useParams();
  let [searchParams] = useSearchParams();
  let query = searchParams.get("q");
  const [result, setResult] = useState<UserProfileEntity[]>([]);

  const [requestedUsers, setRequestedUsers] = useState([]);
  const [pendingUsers, setPedingUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      navigate("/not-found", { replace: false });
    }
    if (!currentUser) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    async function filterResult() {
      switch (filter) {
        case "people":
          setResult(await getPeoples());
          const { data: requested } = await getRequestedUsers(currentUser.id);
          setRequestedUsers(requested);
          const { data: pending } = await getPendingFriendRequest(
            currentUser.id
          );
          setPedingUsers(pending);
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
        ownSelf={people.id === currentUser.id}
      />
    ));
  };

  return (
    <>
      <main className="container right center">{renderResult()}</main>
      <div className="left-content">
        <div className="search-menu__container">
          <h1 className="search-menu__heading">Search Results</h1>
          <span className="search-filter">Filters</span>
          <div className="search-menu__list">
            <div
              onClick={() => handleFilterSelected("people")}
              className={`search-menu__item ${isActive("people")}`}
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
