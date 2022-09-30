import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import MenuSeparator from "../../components/MenuList/MenuSeparator";
import { getCategories } from "../../services/productService";
import MarketMenuContent from "./MarketMenuContent";
import { getTranslatedCategory } from "../../models/product";

const MarketMenu = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: categories } = await getCategories();
      setCategories(categories);
    }
    init();
  }, []);

  return (
    <>
      <main className="container right m2">
        <MarketMenuContent />
      </main>
      <div className="left-content">
        <MenuList title={t("MARKETPLACE.header")}>
          <MenuItem active={pathname === "/marketplace/all"}>
            <NavLink to={"/marketplace/all"}>{t("MARKETPLACE.all")}</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/marketplace/listing"}>
            <NavLink to={"/marketplace/listing"}>
              {t("MARKETPLACE.createListing")}
            </NavLink>
          </MenuItem>
          <MenuSeparator title={t("MARKETPLACE.categories")} />
          <>
            {categories.map((c) => (
              <MenuItem key={c} active={pathname === `/marketplace/${c}`}>
                <NavLink to={`/marketplace/${c}`}>
                  {getTranslatedCategory(c, t)}
                </NavLink>
              </MenuItem>
            ))}
          </>
        </MenuList>
      </div>
    </>
  );
};

export default MarketMenu;
