import React from "react";

const Button = ({ className, selected, onClick, children }) => {
  return (
    <button
      className={`button ${className || ""} ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
