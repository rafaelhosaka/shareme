import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import { getLanguageByShortName } from "../../models/language";
import { verifyEmail } from "../../services/emailService";
import css from "./VerifyEmailPage.module.scss";

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const language = params.get("lng");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function verify() {
      if (token) {
        try {
          const { data } = await verifyEmail(token);
          if (data === "Your email has been verified") {
            setMessage(t("VERIFY_EMAIL.emailVerified"));
          }
        } catch (ex: any) {
          switch (ex.response.data) {
            case "Invalid URL":
              setMessage(t("VERIFY_EMAIL.invalidURL"));
              break;
            case "EmailToken expired":
              setMessage(t("VERIFY_EMAIL.expiredURL"));
              break;
            default:
              setMessage(ex.response.data);
          }

          setError(true);
        }
      } else {
        navigate("/login");
      }
    }
    verify();

    setTimeout(() => {
      navigate("/login");
    }, 5000);
  }, []);

  useEffect(() => {
    if (changeLanguage) {
      changeLanguage(getLanguageByShortName(language ?? "en"));
    }
  }, [changeLanguage]);

  return (
    <main className="container full center">
      <div className={css["container"]}>
        {error ? (
          <i className="fa-solid fa-circle-xmark fa-5x"></i>
        ) : (
          <i className={`fa-solid fa-circle-check fa-5x`}></i>
        )}
        <h1 className={css["header"]}>{message}</h1>
        {error ? "" : t("VERIFY_EMAIL.nowCanLogin")}
        <p>{t("VERIFY_EMAIL.redirect")}</p>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
