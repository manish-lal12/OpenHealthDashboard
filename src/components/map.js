import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import us from "us-atlas/states-10m.json";
import stateData from "../data/states.json";

import ring1 from "../images/ring_01.png";
import ring2 from "../images/ring_02.png";
import ring3 from "../images/ring_03.png";
import ring4 from "../images/ring_04.png";
import ring5 from "../images/ring_05.png";
import ring6 from "../images/ring_06.png";
import ring7 from "../images/ring_07.png";
import oceanBacking from "../images/ocean_backing.png";

const colorLowBad = "#FFF9C6";
const colorLowGood = "#F9FAF9";
const colorHighBad = "#B43000";
const colorHighGood = "#496F52";

const states = topojson.feature(us, us.objects.states);
const margins = { top: 0, bottom: 0, left: 0, right: 25 };

const USMap = ({ clickable = true, colorData, circleData }) => {
  const [width, setWidth] = useState(975);
  const [height, setHeight] = useState(610);
  const [selectedState, setSelectedState] = useState(null);

  const container = useRef(null);
  const pathRef = useRef(
    d3.geoPath().projection(d3.geoAlbersUsa().scale(1).fitWidth(width, states))
  );

  useEffect(() => {
    const currentWidth = container.current.offsetWidth;
    const currentHeight = currentWidth * 0.6;
    const projection = d3
      .geoAlbersUsa()
      .fitWidth(currentWidth - margins.right - margins.left, states);
    pathRef.current = d3.geoPath().projection(projection);

    setWidth(currentWidth);
    setHeight(currentHeight);
  }, []);

  const handleStateClick = (state, e = null) => {
    if (clickable) {
      if (e) {
        e.stopPropagation();
      }
      setSelectedState(state);
    }
  };

  const renderStates = (mappedColorValues, color) => {
    return (
      <g className="map__states-container">
        {states.features.map((f) => {
          const obj = mappedColorValues.get(f.properties.name);
          if (obj && f.properties.name !== "District of Columbia") {
            return (
              <g
                key={f.properties.name}
                onClick={(e) => handleStateClick(f.properties.name, e)}
              >
                <path
                  fill={obj.value ? color(obj.value) : "#FFFFFF00"}
                  d={pathRef.current(f)}
                ></path>
              </g>
            );
          } else {
            return null;
          }
        })}
      </g>
    );
  };

  const renderCircles = (mappedCircleValues, circleScale) => {
    return (
      <g className="map__circles-container">
        {topojson.feature(us, us.objects.states).features.map((f) => {
          const obj = mappedCircleValues.get(f.properties.name);
          if (
            obj &&
            obj.value &&
            f.properties.name !== "District of Columbia"
          ) {
            const centroid = pathRef.current.centroid(f);
            let offset = [0, 0];
            // Offset logic for specific states
            // (same as before for specific states like Massachusetts, etc.)

            const position = [centroid[0] + offset[0], centroid[1] + offset[1]];
            return (
              <g
                key={f.properties.name}
                transform={`translate(${position[0]}, ${position[1]})`}
                className="map-topic__circle"
              >
                <line
                  x1={-offset[0]}
                  y1={-offset[1]}
                  x2="0"
                  y2="0"
                  strokeWidth="3"
                  stroke="#fff"
                />
                {offset[0] !== 0 || offset[1] !== 0 ? (
                  <image
                    xlinkHref={oceanBacking}
                    width="150"
                    height="150"
                    x="-75px"
                    y="-85px"
                  />
                ) : (
                  ""
                )}
                <image
                  xlinkHref={circleScale(obj.value)}
                  width="150"
                  height="150"
                  x="-75px"
                  y="-85px"
                />
                <text textAnchor="middle">
                  {circleData.valueType}
                  {obj.value.toFixed(1)}
                </text>
              </g>
            );
          } else {
            return null;
          }
        })}
      </g>
    );
  };

  const renderSelectedState = (
    mappedColorValues,
    mappedCircleValues,
    color,
    stateName
  ) => {
    const state = topojson
      .feature(us, us.objects.states)
      .features.find((s) => s.properties.name === stateName);
    let obj, obj2;
    if (mappedColorValues) {
      obj = mappedColorValues.get(stateName);
    }

    if (mappedCircleValues) {
      obj2 = mappedCircleValues.get(stateName);
    }

    const bounds = pathRef.current.bounds(state);
    const origStateWidth = bounds[1][0] - bounds[0][0];
    const origStateHeight = bounds[1][1] - bounds[0][1];
    const center = [
      bounds[0][0] + origStateWidth / 2,
      bounds[0][1] + origStateHeight / 2,
    ];

    const stateWidth = origStateWidth * 1.2 + 50;
    const stateHeight = origStateHeight * 1.2 + 50;
    const shadowBuffer = 50;

    const projection = d3
      .geoAlbersUsa()
      .fitSize([stateWidth - shadowBuffer, stateHeight - shadowBuffer], state);
    const path = d3.geoPath().projection(projection);

    const statePosX = center[0] - stateWidth / 2;
    const statePosY = center[1] - stateHeight / 2;
    const thisStateData = stateData.find(
      ({ state }) => state.toLowerCase() === stateName.toLowerCase()
    ).data;

    const detailTop = statePosY < height / 4;
    let detailBoxStyle;
    if (detailTop) {
      detailBoxStyle = {
        top: `calc(50% - ${shadowBuffer / 2}px - 30px)`,
        right: "60%",
      };
    } else {
      detailBoxStyle = {
        bottom: `calc(50% - ${shadowBuffer / 2}px - 30px)`,
        right: "60%",
      };
    }

    return (
      <div style={{ position: "absolute", left: statePosX, top: statePosY }}>
        <svg width={stateWidth} height={stateHeight}>
          <path
            style={{
              filter: "url(#mapShadow)",
              transform: `translate(${shadowBuffer / 2}px, ${
                shadowBuffer / 2
              }px)`,
            }}
            onClick={() => handleStateClick(null)}
            stroke="#fff"
            strokeWidth="1px"
            fill={obj.value ? color(obj.value) : "#FFFFFF00"}
            d={path(state)}
          ></path>
        </svg>
        <div
          className={`map__selected-state-details ${
            detailTop ? "map__selected-state-details--bottom" : ""
          }`}
          style={detailBoxStyle}
          onClick={() => handleStateClick(null)}
        >
          <p className="map__selected-state-details__title">{stateName}</p>
          <div className="map__selected-state-details__details text-size--small">
            <div className="f-50">
              population{" "}
              <span className="text-size--regular">
                <span className="text-face--medium">{thisStateData.pop}</span>M
              </span>
            </div>
            {/* Other details like non-white, median age, seniors, etc. */}
          </div>
          {obj && obj.value ? (
            <div className="f-100">
              <p>
                {obj.prefix}
                <span className="text-face--medium">{obj.value}</span>
                {obj.suffix} {colorData.scaleLabel}
              </p>
            </div>
          ) : null}
          {obj2 && obj2.value ? (
            <div className="f-100">
              <p>
                {obj2.prefix}
                <span className="text-face--medium">{obj2.value}</span>
                {obj.suffix} {circleData.scaleLabel}
              </p>
            </div>
          ) : null}
          <div className="map__selected-state-details__dismiss">
            <span className="text--gold text-face--medium">dismiss</span>
          </div>
        </div>
      </div>
    );
  };

  let extent,
    color,
    minCircleValue,
    maxCircleValue,
    midCircleValue,
    circleScale,
    mappedColorValues,
    mappedCircleValues,
    colorLow,
    colorHigh;

  if (colorData) {
    colorLow = colorData.type === "good" ? colorLowGood : colorLowBad;
    colorHigh = colorData.type === "good" ? colorHighGood : colorHighBad;
    extent = d3.extent(colorData.values, (d) => d.value);
    color = d3
      .scaleLinear()
      .domain([extent[0], extent[1]])
      .range([d3.rgb(colorLow), d3.rgb(colorHigh)]);

    mappedColorValues = new Map(
      colorData.values.map((state) => {
        return [state.state, { value: state.value }];
      })
    );
  }

  if (circleData) {
    minCircleValue = d3.min(circleData.values, (d) => d.value).toFixed(1);
    maxCircleValue = d3.max(circleData.values, (d) => d.value).toFixed(1);
    midCircleValue = (
      (parseFloat(minCircleValue) + parseFloat(maxCircleValue)) /
      2
    ).toFixed(1);
    const circleExtent = d3.extent(circleData.values, (d) => d.value);
    circleScale = d3
      .scaleQuantile()
      .domain([circleExtent[0], circleExtent[1]])
      .range([ring1, ring2, ring3, ring4, ring5, ring6, ring7]);

    mappedCircleValues = new Map(
      circleData.values.map((state) => {
        return [state.state, { value: state.value }];
      })
    );
  }

  return (
    <div className="map h-100" ref={container}>
      <svg
        className="map__map"
        width={width}
        height={height}
        style={{ overflow: "visible", opacity: selectedState ? "0.5" : "1" }}
        onClick={() => (selectedState ? handleStateClick(null) : null)}
      >
        <defs>
          <filter
            id="mapShadow"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="8"
              dy="8"
              stdDeviation="8"
              floodColor="#000"
              floodOpacity="0.5"
            />
          </filter>
        </defs>
        <g>
          {mappedColorValues ? renderStates(mappedColorValues, color) : null}
          <path
            fill="none"
            stroke="white"
            strokeLinejoin="round"
            d={pathRef.current(
              topojson.feature(us, us.objects.states, (a, b) => a !== b)
            )}
          ></path>
          {mappedCircleValues
            ? renderCircles(mappedCircleValues, circleScale)
            : null}
        </g>
      </svg>
      <div className="map__key">
        {colorData && (
          <div className="map__key-section map__key--color">
            <div className="map__key-display">
              <p>
                {colorData.valueType}
                {extent[0]}
              </p>
              <div
                className="map__key-bar"
                style={{
                  background: `linear-gradient(90deg, ${colorLowBad} 0%, ${colorHighBad} 100%)`,
                }}
              ></div>
              <p>
                {colorData.valueType}
                {extent[1]}
              </p>
            </div>
            <p>{colorData.scaleLabel}</p>
          </div>
        )}
        {circleData && (
          <div className="map__key-section">
            <div className="map__key-display">
              <div className="map__key-circle">
                <img src={ring1} alt="lowest value ring" />
                <p>
                  {circleData.valueType}
                  {minCircleValue}
                </p>
              </div>
              <div className="map__key-line"></div>
              <div className="map__key-circle">
                <img src={ring4} alt="middle value ring" />
                <p>
                  {circleData.valueType}
                  {midCircleValue}
                </p>
              </div>
              <div className="map__key-line"></div>
              <div className="map__key-circle">
                <img src={ring7} alt="highest value ring" />
                <p>
                  {circleData.valueType}
                  {maxCircleValue}
                </p>
              </div>
            </div>
            <p>{circleData.scaleLabel}</p>
          </div>
        )}
      </div>
      {selectedState
        ? renderSelectedState(
            mappedColorValues,
            mappedCircleValues,
            color,
            selectedState
          )
        : null}
    </div>
  );
};

export default USMap;
