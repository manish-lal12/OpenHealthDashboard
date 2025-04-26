import React from "react";
import Text from "react-svg-text";

export const TOP = "TOP";
export const RIGHT = "RIGHT";
export const BOTTOM = "BOTTOM";
export const LEFT = "LEFT";

const defaultAxisStyle = {
  orient: BOTTOM,
  tickSizeInner: 6,
  tickSizeOuter: 6,
  tickPadding: 3,
  strokeWidth: 1,
  strokeColor: "black",
  tickFont: "sans-serif",
  tickFontSize: 10,
};

const Axis = ({
  style = {},
  range,
  values,
  position,
  format,
  center,
  margins,
}) => {
  const axisStyle = { ...defaultAxisStyle, ...style };
  const {
    orient,
    tickSizeInner,
    tickPadding,
    tickSizeOuter,
    strokeWidth,
    strokeColor,
    tickFont,
    tickFontSize,
  } = axisStyle;

  const tickTransformer = (d) =>
    orient === TOP || orient === BOTTOM
      ? `translate(${position(d)}, 0)`
      : `translate(0, ${position(d)})`;

  const k = orient === TOP || orient === LEFT ? -1 : 1;
  const isRight = orient === RIGHT;
  const isLeft = orient === LEFT;
  const isBottom = orient === BOTTOM;
  const isHorizontal = isRight || isLeft;
  const x = isHorizontal ? "x" : "y";
  const y = isHorizontal ? "y" : "x";

  const halfWidth = strokeWidth / 2;
  const range0 = range[0] + halfWidth;
  const range1 = range[range.length - 1] + halfWidth;

  const spacing = Math.max(tickSizeInner, 0) + tickPadding;

  return (
    <g
      className="axis"
      fill="none"
      fontSize={tickFontSize}
      fontFamily={tickFont}
      textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
      strokeWidth={strokeWidth}
    >
      <path
        stroke={strokeColor}
        d={
          isHorizontal
            ? `M${k * tickSizeOuter},${range0}H${halfWidth}V${range1}H${
                k * tickSizeOuter
              }`
            : `M${range0},${k * tickSizeOuter}V${halfWidth}H${range1}V${
                k * tickSizeOuter
              }`
        }
      />
      {values.map((v, idx) => {
        const shouldRenderText = v.getFullYear ? idx % 4 === 0 : true;
        const isLargeTick = v.getFullYear ? idx % 4 === 0 : false;
        let lineProps = { stroke: strokeColor };
        lineProps[`${x}2`] = isLargeTick
          ? k * tickSizeInner * 2
          : k * tickSizeInner;
        lineProps[`${y}1`] = halfWidth;
        lineProps[`${y}2`] = halfWidth;

        const chartTextToRemConversion = 10 / 7.0;
        let textProps = {
          fill: strokeColor,
          dy: "0em",
          verticalAnchor: isLeft || isRight ? "middle" : "end",
          textAnchor: center ? "middle" : null,
          width: isLeft ? margins.left * chartTextToRemConversion : null,
        };
        textProps[`${x}`] = center
          ? 0
          : isBottom
          ? k * spacing + 20
          : k * spacing;
        textProps[`${y}`] = halfWidth;

        return (
          <g key={`tick-${idx}`} opacity={1} transform={tickTransformer(v)}>
            <line {...lineProps} />
            {shouldRenderText && <Text {...textProps}>{format(v)}</Text>}
          </g>
        );
      })}
    </g>
  );
};

export default Axis;
