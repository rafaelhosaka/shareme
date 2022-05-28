import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { NavLink, useSearchParams } from "react-router-dom";
import { searchUsersContainsName } from "../../services/userService";
import "./Search.css";
import PeopleResult from "./People/PeopleResult";
import { replace } from "lodash";

function Search(props) {
  const { filter } = useParams();
  let [searchParams] = useSearchParams();
  let query = searchParams.get("q");
  const [result, setResult] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      navigate("/not-found", { replace: false });
    }
  }, []);

  useEffect(() => {
    async function filterResult() {
      switch (filter) {
        case "people":
          setResult(await getPeoples());
      }
    }

    filterResult();
  }, [filter, query]);

  const getPeoples = async () => {
    try {
      const { data } = await searchUsersContainsName(query);
      return data;
    } catch (ex) {
      if (ex?.response?.status === 404) {
        return [];
      }
    }
  };

  const handleFilterSelected = (filterValue) => {
    setResult([]);
    navigate(`/search/${filterValue}?q=${query}`, { replace: false });
  };

  const isActive = (label) => {
    return label === filter ? "active" : "";
  };

  const renderResult = () => {
    let Component;
    switch (filter) {
      case "people":
        Component = PeopleResult;
        break;
    }
    return result.length ? (
      result.map((data) => <Component key={data.id} data={data} />)
    ) : (
      <div>No result found</div>
    );
  };

  return (
    <>
      <main className="container right">{renderResult()}</main>
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
