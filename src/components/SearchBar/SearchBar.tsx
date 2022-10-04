import { useEffect, useRef } from "react";
import { useToggle } from "../../hook/useToggle";
import css from "./SearchBar.module.scss";

interface SearchBarProps {
  placeHolder?: string;
  onSubmit?: (searchQuery: string) => void;
  onChange?: (searchQuery: string | undefined) => void;
  expanded?: boolean;
  expandable?: boolean;
  searchRef?: boolean;
  focused?: boolean;
}

function SearchBar({
  placeHolder = "",
  onSubmit,
  onChange,
  expanded = false,
  expandable = false,
  focused = false,
}: SearchBarProps) {
  const [showSearch, toggleSearch] = useToggle(expanded);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused) {
      focus();
    }
  }, []);

  useEffect(() => {
    focus();
  }, [showSearch]);

  const focus = () => {
    searchRef?.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = searchRef?.current?.value;
    if (onSubmit && searchQuery) {
      onSubmit(searchQuery);
    }
  };

  const handleChange = () => {
    if (onChange) {
      onChange(searchRef?.current?.value);
    }
  };

  const searchBar = () => {
    return (
      <div className={`${css["search-container"]} ${css.expanded}`}>
        <label htmlFor="search-input">
          <form
            className={css["search__form"]}
            onSubmit={(e) => handleSubmit(e)}
          >
            <i
              className={`${css["search-icon"]} fa-solid fa-magnifying-glass fa-xl m1`}
            ></i>

            <input
              id="search-input"
              ref={searchRef}
              className={`${css.search} p1`}
              placeholder={placeHolder}
              onChange={handleChange}
            />
          </form>
        </label>
      </div>
    );
  };

  const expandableSearchBar = () => {
    return showSearch ? expandedBar() : unExpandedBar();
  };

  const expandedBar = () => {
    return (
      <div className={`${css["search-container"]} ${css.expanded}`}>
        <form className={css["search__form"]} onSubmit={(e) => handleSubmit(e)}>
          <i
            onClick={toggleSearch}
            className={`${css["search-icon"]} fa-solid fa-chevron-left fa-xl m1`}
          ></i>

          <input
            ref={searchRef}
            className={`${css.search} p1`}
            placeholder={placeHolder}
          />
        </form>
      </div>
    );
  };

  const unExpandedBar = () => {
    return (
      <div onClick={toggleSearch} className={`${css["search-container"]} p1`}>
        <i
          className={`${css["search-icon"]} fa-solid fa-magnifying-glass fa-xl`}
        ></i>
      </div>
    );
  };

  if (!expandable) {
    return searchBar();
  }

  return expandableSearchBar();
}

export default SearchBar;
