import React, { useState } from "react";
import { useInput } from "../../hook/useInput";
import authService from "../../services/authService";
import { saveUser } from "../../services/userService";
import { useAlert } from "../../components/Alert/Alert";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import UserProfileEntity from "../../models/userProfile";

import css from "./RegisterForm.module.scss";
import Spinner from "../../components/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/languageContext";

function RegisterForm() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const { value: day, bind: bindDay } = useInput(
    new Date().getDate().toString()
  );
  const { value: month, bind: bindMonth } = useInput(
    new Date().getMonth().toString()
  );
  const { value: year, bind: bindYear } = useInput(
    new Date().getFullYear().toString()
  );
  const [gender, setGender] = useState("");

  const [alert, dispatchAlert] = useAlert();
  const navigate = useNavigate();

  const MONTHS = [
    t("REGISTER_FORM.jan"),
    t("REGISTER_FORM.feb"),
    t("REGISTER_FORM.mar"),
    t("REGISTER_FORM.apr"),
    t("REGISTER_FORM.may"),
    t("REGISTER_FORM.jun"),
    t("REGISTER_FORM.jul"),
    t("REGISTER_FORM.aug"),
    t("REGISTER_FORM.sep"),
    t("REGISTER_FORM.oct"),
    t("REGISTER_FORM.nov"),
    t("REGISTER_FORM.dec"),
  ];

  const currentYear = new Date().getFullYear();

  const createUser = () => {
    return saveUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthDate: new Date(parseInt(year), parseInt(month), parseInt(day)),
      gender: gender,
    } as UserProfileEntity);
  };

  const createUserAccount = () => {
    return authService.createUserAccount({
      username: email,
      password: password,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await createUserAccount();
      if (response.status === 201) {
        await createUser();
      }
      navigate({
        pathname: "/notify",
        search: createSearchParams({
          email,
        }).toString(),
      });
    } catch (ex: any) {
      setLoading(false);
      dispatchAlert(ex.response.data, "danger");
    }
  };

  const firstNameLastNameFormatField = () => {
    return (
      <>
        <input
          className="form-input form-input--gray"
          type="text"
          placeholder={t("REGISTER_FORM.firstName")}
          {...bindFirstName}
          required
        />
        <input
          className="form-input form-input--gray"
          type="text"
          placeholder={t("REGISTER_FORM.lastName")}
          {...bindLastName}
          required
        />
      </>
    );
  };

  const lastNamefirstNameFormatField = () => {
    return (
      <>
        <input
          className="form-input form-input--gray"
          type="text"
          placeholder={t("REGISTER_FORM.lastName")}
          {...bindLastName}
          required
        />
        <input
          className="form-input form-input--gray"
          type="text"
          placeholder={t("REGISTER_FORM.firstName")}
          {...bindFirstName}
          required
        />
      </>
    );
  };

  const yearMonthDayFormatField = () => {
    return (
      <>
        <select className="form-select" {...bindYear}>
          {[...Array(118).keys()].map((x) => (
            <option key={currentYear - x} value={currentYear - x}>
              {currentYear - x}
            </option>
          ))}
        </select>
        <select className="form-select" {...bindMonth}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select className="form-select" {...bindDay}>
          {[...Array(31).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
      </>
    );
  };

  const monthDayYearFormatField = () => {
    return (
      <>
        <select className="form-select" {...bindMonth}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select className="form-select" {...bindDay}>
          {[...Array(31).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
        <select className="form-select" {...bindYear}>
          {[...Array(118).keys()].map((x) => (
            <option key={currentYear - x} value={currentYear - x}>
              {currentYear - x}
            </option>
          ))}
        </select>
      </>
    );
  };

  const getNameFields = () => {
    switch (language.shortName) {
      case "en":
        return firstNameLastNameFormatField();
      case "ja":
        return lastNamefirstNameFormatField();
      default:
        return firstNameLastNameFormatField();
    }
  };

  const getDateFields = () => {
    switch (language.shortName) {
      case "en":
        return monthDayYearFormatField();
      case "ja":
        return yearMonthDayFormatField();
      default:
        return monthDayYearFormatField();
    }
  };

  return (
    <>
      <main className="container full center">
        {alert}

        <div className={`${css["form-register-container"]}`}>
          <div className={`${css.header} p2`}>
            <h1>{t("REGISTER_FORM.signUp")}</h1>
          </div>
          <form
            className={loading ? css["loading"] : ""}
            onSubmit={(e) => handleSubmit(e)}
          >
            <Spinner show={loading} sizeClass="size--400">
              <div className={css["register-fields"]}>
                {getNameFields()}
                <input
                  className="form-input form-input--gray"
                  type="email"
                  placeholder={t("REGISTER_FORM.email")}
                  {...bindEmail}
                  required
                />
                <input
                  className="form-input form-input--gray"
                  type="password"
                  placeholder={t("REGISTER_FORM.newPassword")}
                  {...bindPassword}
                  required
                />
              </div>
              <span className="form-label">{t("REGISTER_FORM.birthday")}</span>
              <div className="grid--3x1">{getDateFields()}</div>
              <span className="form-label">{t("REGISTER_FORM.gender")}</span>
              <div className="grid--2x1">
                <div onClick={() => setGender("female")} className="form-radio">
                  <label htmlFor="female">{t("REGISTER_FORM.female")}</label>
                  <input
                    className="radio-btn"
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                </div>

                <div onClick={() => setGender("male")} className="form-radio">
                  <label htmlFor="male">{t("REGISTER_FORM.male")}</label>
                  <input
                    className="radio-btn"
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <button className="btn btn--small my-2 btn--primary btn--stretched">
                  {t("REGISTER_FORM.signUp")}
                </button>
                <Link
                  to="/login"
                  className="btn btn--small my-2 btn--secondary btn--stretched"
                >
                  {t("REGISTER_FORM.back")}
                </Link>
              </div>
            </Spinner>
          </form>
        </div>
      </main>
    </>
  );
}

export default RegisterForm;
