import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Axes from "./axes";

const BarChartDiverging = ({ data }) => {
  const container = useRef(null);

  const [dimensions, setDimensions] = useState({
    width: 975,
    height: 610,
  });

  useEffect(() => {
    const handleResize = () => {
      if (container.current) {
        setDimensions({
          width: container.current.offsetWidth,
          height: container.current.offsetWidth * 0.66,
        });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const margins = { top: 100, right: 50, bottom: 100, left: 50 };
  const svgDimensions = { width: dimensions.width, height: dimensions.height };
  const halfWidth = svgDimensions.width / 2;
  const axisPadding = 50;

  const maxLValue = d3.max(data.values.map((d) => d.lValue));
  const maxRValue = d3.max(data.values.map((d) => d.rValue));
  const maxValue = d3.max([maxLValue, maxRValue]);

  const xScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([0, halfWidth - margins.right - axisPadding])
    .nice();

  const yScale = d3
    .scaleBand()
    .paddingInner(0.4)
    .domain(data.values.map((d) => d.name))
    .range([margins.top, svgDimensions.height - margins.bottom]);

  const bars = data.values.map((datum) => (
    <g key={datum.id}>
      <rect
        className="bar-chart__bar"
        x={halfWidth - axisPadding - xScale(datum.lValue)}
        y={yScale(datum.name)}
        height={yScale.bandwidth()}
        width={xScale(datum.lValue)}
        fill="url(#barGradientHorizontalReverse)"
      />
      <rect
        className="bar-chart__bar"
        x={halfWidth + axisPadding}
        y={yScale(datum.name)}
        height={yScale.bandwidth()}
        width={xScale(datum.rValue)}
        fill="url(#barGradientHorizontal)"
      />
    </g>
  ));

  const valueLabels = data.values.map((datum) => (
    <g key={datum.id}>
      <text
        className="bar-chart__bar-label"
        x={halfWidth - axisPadding - xScale(datum.lValue) - 10}
        y={yScale(datum.name) + yScale.bandwidth() / 2 + 10}
        textAnchor="end"
      >
        {datum.lValue}
        {data.abbreviation ? data.abbreviation : ""}
      </text>
      <text
        className="bar-chart__bar-label"
        x={halfWidth + axisPadding + xScale(datum.rValue) + 10}
        y={yScale(datum.name) + yScale.bandwidth() / 2 + 10}
        textAnchor="start"
      >
        {datum.rValue}
        {data.abbreviation ? data.abbreviation : ""}
      </text>
    </g>
  ));

  return (
    <div className="bar-chart" ref={container}>
      <svg width={dimensions.width} height={dimensions.height}>
        <defs>
          <linearGradient
            id="barGradientHorizontal"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#EBEBEB", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#EBEBEB", stopOpacity: 0 }}
            />
          </linearGradient>
          <linearGradient
            id="barGradientHorizontalReverse"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#EBEBEB", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#EBEBEB", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <g transform={`translate(${halfWidth}, ${margins.top - 40})`}>
          <line
            className="bar-chart__diverging-divider"
            x1={-halfWidth}
            x2={halfWidth}
            y1="20"
            y2="20"
            fill="none"
            strokeWidth="1px"
          />
          <text
            className="bar-chart__diverging-label"
            textAnchor="end"
            x={-axisPadding}
          >
            {data.leftAxisLabel}
          </text>
          <text
            className="bar-chart__diverging-label"
            textAnchor="start"
            x={axisPadding}
          >
            {data.rightAxisLabel}
          </text>
        </g>
        <g
          transform={`translate(${halfWidth}, ${
            svgDimensions.height - margins.bottom + 60
          })`}
        >
          <line
            className="bar-chart__diverging-divider"
            x1={-halfWidth}
            x2={halfWidth}
            y1="-35"
            y2="-35"
            fill="none"
            strokeWidth="1px"
          />
          <text className="bar-chart__diverging-label" textAnchor="middle">
            {data.yAxisLabel}
          </text>
        </g>
        <Axes
          scales={{ y: { scale: yScale } }}
          margins={margins}
          svgDimensions={svgDimensions}
          center={true}
        />
        <g>{bars}</g>
        <g>{valueLabels}</g>
      </svg>
    </div>
  );
};

export default BarChartDiverging;
