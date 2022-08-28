import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import css from "./VerifyEmailPage.module.scss";

const NotifyEmailPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParam] = useSearchParams();
  const email = searchParam.get("email");

  return (
    <main className="container full center">
      <div className={css["container"]}>
        <i className="fa-solid fa-envelope-open-text fa-10x"></i>
        <h1 className={css["header"]}>{t("NOTIFY_EMAIL.header")}</h1>
        <p>
          {t("NOTIFY_EMAIL.bodyFirst")}
          <strong>{email}</strong>
          {t("NOTIFY_EMAIL.bodySecond")}
        </p>
        <p className={language.shortName === "ja" ? css["invert"] : ""}>
          <strong className={css["link"]}>
            <Link to="/resend">{t("NOTIFY_EMAIL.clickHere")}</Link>
          </strong>
          <span className={css["link-body"]}>
            {t("NOTIFY_EMAIL.notReceiveEmail")}
          </span>
        </p>
        <p className={language.shortName === "ja" ? css["invert"] : ""}>
          <strong className={css["link"]}>
            <Link to="/recover">{t("NOTIFY_EMAIL.clickHere")}</Link>
          </strong>
          <span className={css["link-body"]}>
            {t("NOTIFY_EMAIL.wantChangePassword")}
          </span>
        </p>
      </div>
    </main>
  );
};

export default NotifyEmailPage;
