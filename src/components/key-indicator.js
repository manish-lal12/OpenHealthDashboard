import React from "react";
import Stat from "./stat";
import Button from "./button";
import { ReactComponent as IconGraph } from "../images/icons/graph.svg";
import { ReactComponent as IconMap } from "../images/icons/map.svg";
import { ReactComponent as IconNumbers } from "../images/icons/numbers.svg";

const KeyIndicator = ({
  data,
  selected,
  onClick,
  mapButtons,
  displayTitle = true,
  children,
}) => {
  const selectedColor = selected === "color" || selected === "both";
  const selectedCircle = selected === "circle" || selected === "both";

  return (
    <div className="key-indicator">
      <div
        className={`key-indicator__indicator ${selected ? "selected" : ""} ${
          mapButtons ? "key-indicator__indicator--map-buttons" : ""
        }`}
        onClick={() => !mapButtons && onClick(data)}
      >
        <div
          className={`key-indicator__indicator__bar ${
            selected ? "selected" : ""
          }`}
        />
        {mapButtons ? (
          <div className="key-indicator__buttons key-indicator__buttons--fixed button-group">
            <Button
              selected={selectedColor}
              onClick={() => onClick(data, "color")}
              className="button--center"
            >
              <IconMap
                className={`icon ${selectedColor ? "icon--blue" : ""}`}
              />
            </Button>
            <Button
              selected={selectedCircle}
              onClick={() => onClick(data, "circle")}
              className="button--center"
            >
              <IconNumbers
                className={`icon ${selectedCircle ? "icon--blue" : ""}`}
              />
            </Button>
          </div>
        ) : (
          <div className="key-indicator__buttons key-indicator__buttons--fixed button-group">
            <Button
              selected={selected}
              onClick={() => onClick(data)}
              className="button--center"
            >
              <IconGraph className={`icon ${selected ? "icon--blue" : ""}`} />
            </Button>
          </div>
        )}
        <div>
          {displayTitle && <p className="key-indicator__title">{data.title}</p>}
          <Stat data={data} />
        </div>
      </div>
      {children && (
        <div className="key-indicator__supporting-data">{children}</div>
      )}
    </div>
  );
};

export default KeyIndicator;
