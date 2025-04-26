import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Axes from "./axes";

const LineChart = ({
  data,
  className,
  grid,
  dots,
  zeroYAxis,
  title,
  yAxisLabel,
}) => {
  const [width, setWidth] = useState(975);
  const [height, setHeight] = useState(610);
  const [selectedYear, setSelectedYear] = useState(null);
  const container = useRef(null);

  useEffect(() => {
    setWidth(container.current.offsetWidth);
    setHeight(container.current.offsetWidth * 0.5);
  }, []);

  const handleLineClick = (year) => {
    setSelectedYear((prevYear) => (year === prevYear ? null : year));
  };

  const renderPopup = (data, xScale, yScale, colorScale) => {
    return data.values.map((lineData) => {
      const targetData = lineData.values.find(
        (d) => parseInt(d.year) === parseInt(selectedYear)
      );
      if (targetData) {
        return (
          <g
            key={lineData.id}
            className="line-chart__popup"
            transform={`translate(${xScale(
              new Date(targetData.year.toString())
            )}, ${yScale(targetData.value)})`}
          >
            <text x="6px" y="-6px" textAnchor="start">
              {targetData.value}
            </text>
          </g>
        );
      } else {
        return null;
      }
    });
  };

  const margins = { top: 20, right: 50, bottom: 50, left: 100 };
  const svgDimensions = { width, height };

  let extents = [];
  let timeExtents = [];
  let allYears = [];

  data.values.forEach((lineData) => {
    const years = lineData.values.map(
      (d) => new Date("01-01-" + d.year.toString())
    );
    allYears.push(years.map((year) => year.getFullYear()));
    extents.push(d3.extent(lineData.values, (d) => d.value));
    timeExtents.push(d3.extent(years, (d) => d));
  });

  allYears = [...new Set(allYears.flat())];

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.values.map((d) => d.label))
    .range(
      data.values.length <= 2
        ? ["#D2DBE8", "#597397"]
        : ["#D2DBE8", "#597397", "#A9B675", "#9B9B9B", "#995E5E"]
    );

  const maxValue =
    extents.length === 1
      ? extents[0][1]
      : extents.reduce((a, b) => [0, Math.max(a[1], b[1])])[1];
  let minValue =
    extents.length === 1
      ? extents[0][0]
      : extents.reduce((a, b) => [Math.min(a[0], b[0]), 0])[0];
  if (zeroYAxis) minValue = 0;
  const buffer = zeroYAxis ? 0 : (maxValue - minValue) * 0.1;
  const timeExtent = d3.extent(timeExtents.flat(), (d) => d);

  const xScale = d3
    .scaleTime()
    .domain([timeExtent[0], new Date("01-01-2020")])
    .range([margins.left, svgDimensions.width - margins.right]);

  const yScale = d3
    .scaleLinear()
    .domain([minValue - buffer, maxValue + buffer])
    .range([svgDimensions.height - margins.bottom, margins.top]);

  const valueLine = d3
    .line()
    .x((d) => xScale(new Date(d.year.toString())))
    .y((d) => yScale(d.value));

  const totalYears =
    xScale.domain()[1].getFullYear() - xScale.domain()[0].getFullYear();
  let tickCount = d3.timeYear.every(1);
  let clickBarWidthMultiplier = 1;

  if (totalYears >= 25) {
    tickCount = d3.timeYear.every(2);
    clickBarWidthMultiplier = 2;
  }

  const clickBarWidth =
    (width - margins.left - margins.right) /
    (xScale.ticks().length * clickBarWidthMultiplier) /
    2;

  const largeTickYear = (d) => {
    return d.getFullYear() % 4 === 0;
  };

  return (
    <div className={`line-chart ${className}`} ref={container}>
      <p className="line-chart__title">{title || "\u00A0"}</p>
      <p className="line-chart__y-axis-title">{yAxisLabel}</p>
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes
          scales={{
            x: {
              scale: xScale,
              showTickMarks: true,
              tickCount: tickCount,
              largeTick: largeTickYear,
            },
            y: {
              scale: yScale,
              showTickMarks: false,
            },
          }}
          grid={grid || true}
          margins={margins}
          svgDimensions={svgDimensions}
        />
        {selectedYear && (
          <line
            className="line-chart__selected-year-line"
            x1={xScale(new Date(selectedYear.toString()))}
            y1={margins.top}
            x2={xScale(new Date(selectedYear.toString()))}
            y2={height - margins.bottom}
          />
        )}
        {data.values.map((lineData) => (
          <g key={lineData.id} className="line-chart__line">
            <path
              d={valueLine(lineData.values)}
              stroke={colorScale(lineData.label)}
            />
            {(dots || selectedYear) &&
              lineData.values.map((d) => (
                <circle
                  key={d.id}
                  cx={xScale(new Date(d.year.toString()))}
                  cy={yScale(d.value)}
                  r="5"
                  strokeWidth="1px"
                  stroke="#000"
                  fill={colorScale(lineData.label)}
                />
              ))}
          </g>
        ))}
        {selectedYear && renderPopup(data, xScale, yScale, colorScale)}
        <g className="line-chart__click">
          {allYears.map((year) => {
            const xPos = xScale(new Date(year.toString()));
            return (
              <rect
                key={year}
                x={xPos - clickBarWidth / 2}
                y={0}
                width={clickBarWidth}
                height={height - margins.bottom}
                className="line-chart__click"
                onClick={() => handleLineClick(year)}
              />
            );
          })}
        </g>
      </svg>
      <div className="line-chart__legend">
        {data.values.map((d) => (
          <p key={d.id}>
            <span
              className="line-chart__legend__line"
              style={{ backgroundColor: colorScale(d.label) }}
            ></span>
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
