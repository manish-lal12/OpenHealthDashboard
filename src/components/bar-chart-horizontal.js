import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Text from "react-svg-text";

const BarChartHorizontal = ({
  data,
  layout,
  title,
  yAxisLabel,
  xAxisLabel,
}) => {
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
          height: container.current.offsetWidth * 0.6,
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

  const bigMargin = 320;
  const littleMargin = 220;
  const leftMargin = layout === "lens" ? bigMargin : littleMargin;

  const margins = { top: 20, right: 100, bottom: 20, left: leftMargin };
  const middlePadding = 10;
  let barThickness = 30;

  if (data.values.length < 5) barThickness = 40;

  const yPadding = 26;
  const getYValue = (index) => margins.top + index * (barThickness + yPadding);

  const totalHeight =
    getYValue(data.values.length - 1) + barThickness + margins.bottom;
  const svgDimensions = { width: dimensions.width, height: totalHeight };

  const maxValue = d3.max(data.values.map((d) => d.value));

  const xScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([0, svgDimensions.width - margins.right - margins.left])
    .nice();

  const bars = data.values.map((datum, index) => (
    <rect
      key={datum.id}
      className="bar-chart__bar"
      x={margins.left}
      y={getYValue(index)}
      height={barThickness}
      width={xScale(datum.value)}
      fill="url(#barGradientHorizontal)"
    />
  ));

  const valuePadding = 15;
  const valueOffset = 3;
  const valueLabels = data.values.map((datum, index) => (
    <Text
      key={datum.id}
      className="bar-chart__bar-value"
      x={xScale(datum.value) + margins.left + valuePadding}
      y={getYValue(index) + barThickness / 2 - valueOffset}
      dy={0}
      textAnchor="start"
      verticalAnchor="middle"
    >
      {datum.value}
    </Text>
  ));

  const chartTextToRemConversion = 10 / 7.0;
  const catOffset = 2;
  const categoryLabels = data.values.map((datum, index) => (
    <Text
      key={datum.id}
      className="bar-chart__bar-label"
      x={margins.left - middlePadding}
      y={getYValue(index) + barThickness / 2}
      dy={0}
      width={margins.left * chartTextToRemConversion - catOffset}
      textAnchor="end"
      verticalAnchor="middle"
    >
      {datum.name}
    </Text>
  ));

  return (
    <div className="bar-chart bar-chart--horizontal" ref={container}>
      <p className="bar-chart__title">{title}</p>
      <span className="bar-chart__y-axis-title">{yAxisLabel}</span>
      <span className="bar-chart__x-axis-title">{xAxisLabel}</span>
      <svg width={svgDimensions.width} height={svgDimensions.height}>
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
        </defs>
        <g>{bars}</g>
        <g>{valueLabels}</g>
        <g>{categoryLabels}</g>
      </svg>
    </div>
  );
};

export default BarChartHorizontal;
