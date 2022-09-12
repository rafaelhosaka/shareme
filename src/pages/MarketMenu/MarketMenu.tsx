import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import MarketMenuContent from "./MarketMenuContent";

const MarketMenu = () => {
  const { pathname } = useLocation();

  return (
    <>
      <main className="container right m2">
        <MarketMenuContent />
      </main>
      <div className="left-content">
        <MenuList title={"Marketplace"}>
          <MenuItem active={pathname === "/marketplace/all"}>
            <NavLink to={"/marketplace/all"}>All</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/marketplace/listing"}>
            <NavLink to={"/marketplace/listing"}>Create new listing</NavLink>
          </MenuItem>
        </MenuList>
      </div>
    </>
  );
};

export default MarketMenu;
