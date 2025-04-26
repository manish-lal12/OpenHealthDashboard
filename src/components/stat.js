import React from "react";

const Stat = ({ data }) => {
  const {
    prefix = "",
    stat = "0",
    abbreviation = "",
    description = "No description available.",
  } = data;

  return (
    <div className="stat">
      <div className="stat__value margin--none">
        <div className="prefix">{prefix && <span>{prefix}</span>}</div>
        <div className="number">{stat}</div>
        <div className="suffix">
          {abbreviation && <span>{abbreviation}</span>}
        </div>
      </div>
      <div className="stat__description">
        <p className="text--gray--light margin--none">{description}</p>
      </div>
    </div>
  );
};

export default Stat;
