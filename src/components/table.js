import React from "react";

const Table = ({ data }) => {
  return (
    <div className="table">
      <table className="table__table">
        {data.labelRow || data.headerRow ? (
          <thead>
            {data.labelRow && (
              <tr className="table__row table__row--labels">
                {data.labelRow.map((label, index) => (
                  <td key={index}>{label}</td>
                ))}
              </tr>
            )}
            {data.headerRow && (
              <tr className="table__row table__row--headers">
                {data.headerRow.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            )}
          </thead>
        ) : null}
        {data.rows.map((row, i) => (
          <tr
            key={i}
            className={`table__row ${i % 2 === 0 ? "table__row--alt" : ""}`}
          >
            {row.map((d, index) => (
              <td key={index}>{d}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Table;
