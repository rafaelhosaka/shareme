import React, { useState } from "react";
import { useInput } from "../../hook/useInput";
import authService from "../../services/authService";
import { saveUser } from "../../services/userService";
import { useAlert } from "../../components/Alert/Alert";
import { Link, useNavigate } from "react-router-dom";
import AlertEntity from "../../models/alert";
import UserProfileEntity from "../../models/userProfile";

import css from "./RegisterForm.module.scss";

function RegisterForm() {
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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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

      const response = await createUserAccount();
      if (response.status === 201) {
        await createUser();
        navigate("/login", {
          state: {
            alert: {
              message: "Account created, please login",
              type: "success",
            } as AlertEntity,
          },
        });
      }
    } catch (ex: any) {
      dispatchAlert(ex.response.data, "danger");
    }
  };

  return (
    <main className="container full center">
      {alert}

      <div className={`${css["form-register-container"]}`}>
        <div className={`${css.header} p2`}>
          <h1>Sign Up</h1>
        </div>
        <form className={`p1`} onSubmit={(e) => handleSubmit(e)}>
          <div className={css["register-fields"]}>
            <input
              className="form-input form-input--gray"
              type="text"
              placeholder="First name"
              {...bindFirstName}
              required
            />
            <input
              className="form-input form-input--gray"
              type="text"
              placeholder="Last name"
              {...bindLastName}
              required
            />

            <input
              className="form-input form-input--gray"
              type="email"
              placeholder="Email"
              {...bindEmail}
              required
            />

            <input
              className="form-input form-input--gray"
              type="password"
              placeholder="New Password"
              {...bindPassword}
              required
            />
          </div>
          <span className="form-label">Birthday</span>
          <div className="grid--3x1">
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
          </div>
          <span className="form-label">Gender</span>
          <div className="grid--2x1">
            <div onClick={() => setGender("female")} className="form-radio">
              <label htmlFor="female">Female</label>
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
              <label htmlFor="male">Male</label>
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
              Sign Up
            </button>
            <Link
              to="/login"
              className="btn btn--small my-2 btn--secondary btn--stretched"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default RegisterForm;
