import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Text from "react-svg-text";

const BarChart = ({ data }) => {
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
          height: container.current.offsetWidth * 0.5,
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

  const margins = { top: 50, right: 0, bottom: 40, left: 0 };
  const svgDimensions = { width: dimensions.width, height: dimensions.height };

  const maxValue = d3.max(data.values.map((d) => d.value));

  const xScale = d3
    .scaleBand()
    .paddingInner(0.2)
    .domain(data.values.map((d) => d.name))
    .range([margins.left, svgDimensions.width - margins.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([svgDimensions.height - margins.bottom, margins.top]);

  const bars = data.values.map((datum) => (
    <rect
      key={datum.id}
      className="bar-chart__bar"
      x={xScale(datum.name)}
      y={yScale(datum.value)}
      height={svgDimensions.height - margins.bottom - yScale(datum.value)}
      width={xScale.bandwidth()}
      fill="url(#barGradient)"
    />
  ));

  const valueLabels = data.values.map((datum) => (
    <text
      key={datum.id}
      className="bar-chart__bar-value"
      x={xScale(datum.name) + xScale.bandwidth() / 2}
      y={yScale(datum.value) - 10}
      textAnchor="middle"
    >
      {datum.value}
      {data.abbreviation ? data.abbreviation : ""}
    </text>
  ));

  const categoryLabels = data.values.map((datum, index) => {
    const _x = xScale(datum.name) + xScale.bandwidth() / 2;
    const _y = svgDimensions.height - margins.bottom;
    return (
      <Text
        transform={`rotate(${
          svgDimensions.width / data.values.length < 140 ? 30 : 0
        }, ${_x} , ${_y})`}
        className="bar-chart__bar-label"
        key={datum.id}
        x={_x}
        y={_y}
        textAnchor="middle"
        verticalAnchor="start"
        dy={0}
        width={140}
      >
        {datum.name}
      </Text>
    );
  });

  return (
    <div className="bar-chart" ref={container}>
      <p className="bar-chart__title">{data.title}</p>
      <p className="bar-chart__y-axis-title">{data.yAxisLabel}</p>
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
        <g>{bars}</g>
        <g>{valueLabels}</g>
        <g>{categoryLabels}</g>
      </svg>
      <p className="bar-chart__x-axis-title">{data.xAxisLabel}</p>
    </div>
  );
};

export default BarChart;
