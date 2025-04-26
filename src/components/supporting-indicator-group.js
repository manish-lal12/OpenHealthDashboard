import React from "react";
import SupportingIndicator from "./supporting-indicator";

const SupportingIndicatorGroup = ({ data, lastOne }) => {
  let lastType = "";

  return (
    <div
      className={`supporting-indicator-group pad-all ${
        lastOne ? "last-one" : ""
      }`}
    >
      <h3 className="supporting-indicator-group__title margin--none">
        {data.title}
      </h3>
      {data.indicators.map((indicatorData, index) => {
        let thisType = indicatorData.type;
        let result = (
          <SupportingIndicator key={indicatorData.id} data={indicatorData} />
        );
        if (lastType === "stat" && thisType !== "stat") {
          result = (
            <div key={indicatorData.id}>
              <div className="supporting-indicator__divider" />
              <SupportingIndicator data={indicatorData} />
            </div>
          );
        }
        lastType = thisType;
        return result;
      })}
    </div>
  );
};

export default SupportingIndicatorGroup;
