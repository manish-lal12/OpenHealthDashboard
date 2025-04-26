import React, { useMemo } from "react";
import { axisPropsFromBandedScale } from "react-d3-axis";
import { LEFT, BOTTOM } from "./axis";
import Axis from "./axis";

const Axes = ({ scales, margins, svgDimensions, grid, center }) => {
  const { width, height } = svgDimensions;

  // Format the text for ticks
  const formatText = (d) => {
    return d.getFullYear && typeof d.getFullYear === "function"
      ? d.getFullYear()
      : d.toString();
  };

  // Decide whether to render text for each tick or not
  const shouldRenderText = (d, ticks, position) => {
    if (grid && position === LEFT && ticks.indexOf(d) % 2 !== 0) {
      return null;
    } else {
      return formatText(d);
    }
  };

  // Render Axis based on scale type
  const renderAxisFromScaleType = (scaleObj, position, margins) => {
    if (
      scaleObj.scale.bandwidth &&
      typeof scaleObj.scale.bandwidth === "function"
    ) {
      return (
        <Axis
          {...axisPropsFromBandedScale(scaleObj.scale)}
          largeTick={scaleObj.largeTick}
          style={{ orient: position }}
          center={center}
          margins={margins}
        />
      );
    } else {
      return (
        <Axis
          range={scaleObj.scale.range()}
          values={scaleObj.scale.ticks(scaleObj.tickCount)}
          format={(d) => shouldRenderText(d, scaleObj.scale.ticks(), position)}
          position={scaleObj.scale.copy()}
          style={{ orient: position }}
          largeTick={scaleObj.largeTick}
          center={center}
          margins={margins}
        />
      );
    }
  };

  // Render the grid lines if enabled
  const renderGrid = useMemo(() => {
    if (grid && scales.y) {
      return (
        <g className="axis__grid">
          <rect
            x={margins.left}
            y={margins.top}
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            fill={
              grid === "light"
                ? "url(#lineChartGradientLight)"
                : "url(#lineChartGradient)"
            }
          />
          {scales.y.scale.ticks(scales.y.tickCount).map((t) => (
            <rect
              key={t}
              className="axis__grid-line"
              x={margins.left}
              y={scales.y.scale(t)}
              width={width - margins.left - margins.right}
              height="2px"
            />
          ))}
        </g>
      );
    }
    return null;
  }, [grid, scales, margins, width, height]);

  return (
    <g className="axes">
      <defs>
        <linearGradient
          id="lineChartGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            style={{ stopColor: "#334467", stopOpacity: 0.62 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#334467", stopOpacity: 0.2 }}
          />
        </linearGradient>
        <linearGradient
          id="lineChartGradientLight"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            style={{ stopColor: "#DFE8F5", stopOpacity: 0.2 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#DFE8F5", stopOpacity: 0.01 }}
          />
        </linearGradient>
      </defs>

      {renderGrid}

      {scales.y && (
        <g
          transform={`translate(${center ? width / 2 : margins.left}, 0)`}
          className={scales.y.showTickMarks ? "" : "axis--no-ticks"}
        >
          {renderAxisFromScaleType(scales.y, LEFT, margins)}
        </g>
      )}

      {scales.x && (
        <g
          transform={`translate(0, ${height - margins.bottom})`}
          className={`axis axis--bottom ${
            scales.x.showTickMarks ? "" : "axis--no-ticks"
          } ${grid ? "axis--time" : ""}`}
        >
          {renderAxisFromScaleType(scales.x, BOTTOM, margins)}
        </g>
      )}
    </g>
  );
};

export default Axes;
