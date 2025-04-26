import React from "react";

const Citations = ({ data }) => {
  return (
    <div className="citations h-100 pad-all">
      {data.map((citation, index) => {
        if (citation != null) {
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: citation }} />
          );
        } else {
          return null;
        }
      })}
      <p className="dismiss-text">dismiss</p>
    </div>
  );
};

export default Citations;
