import React from "react";

function Button({ label, ...rest }) {
  return <button {...rest}>{label}</button>;
}

export default Button;
