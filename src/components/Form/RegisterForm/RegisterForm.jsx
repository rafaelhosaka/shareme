import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useInput } from "../../../hook/useInput";
import authService from "../../../services/authService";
import { saveUser } from "../../../services/userService";

import "./RegisterForm.css";

function RegisterForm(props) {
  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const { value: day, bind: bindDay } = useInput(new Date().getDate());
  const { value: month, bind: bindMonth } = useInput(new Date().getMonth());
  const { value: year, bind: bindYear } = useInput(new Date().getFullYear());
  const [gender, setGender] = useState("");

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

  const createUser = async () => {
    await saveUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthDate: new Date(year, month, day),
      gender: gender,
    });
  };

  const createUserAccount = async () => {
    const response = await authService.createUserAccount({
      username: email,
      password: password,
    });
    return response;
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      createUserAccount().then((response) => {
        if (response.status === 201) {
          createUser();
          window.location = "/login";
        }
      });
    } catch (ex) {}
  };

  return (
    <main className="container">
      <img
        className="login-logo"
        src={"./images/logo-full.png"}
        alt="Logo of the Shareme"
      />
      <div className="form-register-container">
        <div className="form-register-header">
          <h1>Sign Up</h1>
        </div>
        <form className="form-login" onSubmit={(e) => handleSubmit(e)}>
          <div className="grid--2x1">
            <input
              className="form-input form-input--gray"
              type="text"
              placeholder="First name"
              {...bindFirstName}
            />
            <input
              className="form-input form-input--gray"
              type="text"
              placeholder="Last name"
              {...bindLastName}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input form-input--gray"
              type="email"
              placeholder="Email"
              {...bindEmail}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input form-input--gray"
              type="password"
              placeholder="New Password"
              {...bindPassword}
            />
          </div>
          <div className="grid--3x1">
            <select className="form-select" {...bindMonth}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <select className="form-select" {...bindDay}>
              {[...Array(31)].map((x, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="form-select" {...bindYear}>
              {[...Array(118)].map((x, i) => (
                <option key={currentYear - i} value={currentYear - i}>
                  {currentYear - i}
                </option>
              ))}
            </select>
          </div>
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
            <button className="btn btn--green btn--stretched">Sign Up</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default RegisterForm;
