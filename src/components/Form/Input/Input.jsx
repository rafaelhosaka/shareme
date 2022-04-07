import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} />
      {error && <div className="alert alert-danger">{error}</div>}
    </>
  );
};

export default Input;
