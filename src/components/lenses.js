import React, { useState, useEffect } from "react";
import BarChart from "./bar-chart";
import BarChartHorizontal from "./bar-chart-horizontal";
import BarChartDiverging from "./bar-chart-diverging";
import LineChart from "./line-chart";
import USMap from "./map";
import { ReactComponent as IconTime } from "../images/icons/time.svg";
import { ReactComponent as IconState } from "../images/icons/state.svg";
import { ReactComponent as IconDemographics } from "../images/icons/demographics.svg";
import { ReactComponent as IconGlobal } from "../images/icons/global.svg";

const lensOptions = {
  time: {
    title: "Time",
    icon: <IconTime className="icon" />,
  },
  state: {
    title: "State",
    icon: <IconState className="icon" />,
  },
  demogr: {
    title: "Demogr",
    icon: <IconDemographics className="icon" />,
  },
  global: {
    title: "Global",
    icon: <IconGlobal className="icon" />,
  },
};

const Lenses = (props) => {
  const [selectedLens, setSelectedLens] = useState(props.data[0].lensType);
  const [selectedLensData, setSelectedLensData] = useState(props.data[0]);

  useEffect(() => {
    if (props.selectedKeyIndicator !== props.selectedKeyIndicator) {
      const initialLens = props.data[0].lensType;
      updateLens(initialLens);
    }
  }, [props.selectedKeyIndicator]);

  const updateLens = (lensType) => {
    const lensData = props.data.find((lens) => lens.lensType === lensType);
    setSelectedLens(lensType);
    setSelectedLensData(lensData);
  };

  const onLensChange = (e) => {
    const selectedLensType = e.currentTarget.value;
    updateLens(selectedLensType);
  };

  const renderLensData = (data) => {
    if (!data || !data.type) {
      console.error("Invalid lens data:", data);
      return null;
    }

    let layout = props.layout ? props.layout : "lens";
    switch (data.type) {
      case "chart":
        switch (data.chartType) {
          case "bar":
            return (
              <div className="bar-chart-wrapper">
                <BarChart data={data} layout={layout} />
              </div>
            );
          case "barHorizontal":
            return (
              <div className="bar-chart-wrapper">
                <BarChartHorizontal data={data} layout={layout} />
              </div>
            );
          case "barDiverging":
            return (
              <div className="bar-chart-wrapper">
                <BarChartDiverging data={data} layout={layout} />
              </div>
            );
          case "line":
            return <LineChart data={data} layout={layout} />;
          default:
            return null;
        }
      case "map":
        return <USMap colorData={data} clickable={false} layout={layout} />;
      default:
        return null;
    }
  };

  const renderLensOptions = () => {
    return (
      <ul className="lenses__options">
        {props.data.map((lens) => (
          <li key={lens.id}>
            <label className={selectedLens === lens.lensType ? "selected" : ""}>
              <input
                type="radio"
                value={lens.lensType}
                checked={selectedLens === lens.lensType}
                onChange={onLensChange}
              />
              <span>
                {lensOptions[lens.lensType]
                  ? lensOptions[lens.lensType].title
                  : lens.lensType}
              </span>
              {lensOptions[lens.lensType]
                ? lensOptions[lens.lensType].icon
                : null}
            </label>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="lenses text--chart">
      <div className="lenses__bar" />
      <div
        className={`lenses__container ${props.bottom ? "lenses--bottom" : ""}`}
      >
        {!props.bottom ? renderLensOptions() : null}
        <div className="lenses__data">{renderLensData(selectedLensData)}</div>
        {props.bottom ? renderLensOptions() : null}
      </div>
      <div className="lenses__bar" />
    </div>
  );
};

export default Lenses;
