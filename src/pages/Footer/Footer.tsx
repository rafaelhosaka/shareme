import { useEffect } from "react";
import { useInput } from "../../hook/useInput";
import { changeLanguage } from "../../translations/i18n";
import css from "./Footer.module.scss";

const Footer = () => {
  const { value: language, bind: bindLanguage } = useInput("en");

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <div className={css["footer"]}>
      <select className="form-select small" {...bindLanguage}>
        <option value="en">English</option>
        <option value="jp">日本語</option>
      </select>
      Rafael Hideki Hosaka © 2022 ShareMe {process.env.REACT_APP_VERSION}
    </div>
  );
};

export default Footer;
