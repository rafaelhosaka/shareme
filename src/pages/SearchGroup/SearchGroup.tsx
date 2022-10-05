import { useState } from "react";
import { useTranslation } from "react-i18next";
import GroupList from "./Result/GroupResultList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { GroupEntity } from "../../models/group";
import { searchGroupsContainsName } from "../../services/groupService";
import css from "./SearchGroup.module.scss";

const SearchGroup = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupEntity[]>([]);
  const [beforeSearch, setBeforeSearch] = useState(true);

  async function getGroups(query: string) {
    const { data } = await searchGroupsContainsName(query);
    setGroups(data);
  }

  const handleSubmit = (searchQuery: string | undefined) => {
    if (searchQuery) {
      getGroups(searchQuery);
      setBeforeSearch(false);
    }
  };

  const renderResult = () => {
    if (beforeSearch) {
      return (
        <div className={css["result"]}>{t("SEARCH_GROUP.beforeSearch")}</div>
      );
    }

    if (groups.length > 0) {
      return <GroupList groups={groups} />;
    }

    return <div className={css["result"]}>{t("SEARCH_GROUP.noResult")}</div>;
  };

  return (
    <div className={css["container"]}>
      <header className={css["header"]}>
        <h2>{t("SEARCH_GROUP.header")}</h2>
        <SearchBar
          placeHolder={t("SEARCH_GROUP.searchPlaceholder")}
          onSubmit={handleSubmit}
          focused
        />
      </header>
      {renderResult()}
    </div>
  );
};

export default SearchGroup;
