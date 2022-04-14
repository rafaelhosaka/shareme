import React from "react";

const TextArea = ({ name, label, error, ...rest }) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <textarea cols="120" {...rest} name={name} id={name} />
      {error && <div className="alert alert--danger">{error}</div>}
    </>
  );
};

export default TextArea;
