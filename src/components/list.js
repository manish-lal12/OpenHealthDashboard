import React from "react";

const List = ({ data }) => {
  return (
    <div className="list">
      <div className="list__empty"> </div>
      <div className="list__content">
        <span className="list__label">{data.label}</span>
        <span className="list__values">
          {data.list.map((d, i) => (i === data.list.length - 1 ? d : `${d}, `))}
        </span>
      </div>
    </div>
  );
};

export default List;
