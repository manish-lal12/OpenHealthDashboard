import React, { useState, useEffect } from "react";

import USMap from "./map";
import KeyIndicator from "./key-indicator";
import Lenses from "./lenses";
import Citations from "./citations";
import TopicSelect from "./topic-select";
import { ReactComponent as IconBook } from "../images/icons/book.svg";
import { ReactComponent as ButtonShape } from "../images/round_button.svg";

// Define getLensData function before the component
const getLensData = (props) => {
  const lenses = [];

  props.data.keyIndicators.forEach((d) => {
    const lensData = d.lensData.filter((ld) => ld.type !== "map");

    if (lensData.length) {
      lenses.push(lensData);
    }
  });

  return lenses.slice(0, 3);
};

const MapTopic = (props) => {
  const [selectedIndicator, setSelectedIndicator] = useState({
    color: {
      title: props.data.keyIndicators[0].title,
      data: props.data.keyIndicators[0].lensData.find((d) => d.type === "map"),
    },
    circle: {
      title: props.data.keyIndicators[1].title,
      data: props.data.keyIndicators[1].lensData.find((d) => d.type === "map"),
    },
  });

  const [topic, setTopic] = useState(props.data.title);
  const [lensData, setLensData] = useState(getLensData(props)); // Now this will work
  const [citations, setCitations] = useState(false);
  const [showTopicSelect, setShowTopicSelect] = useState(false);

  useEffect(() => {
    if (props.data.keyIndicators !== props.data.keyIndicators) {
      setSelectedIndicator({
        color: {
          title: props.data.keyIndicators[0].title,
          data: props.data.keyIndicators[0].lensData.find(
            (d) => d.type === "map"
          ),
        },
        circle: {
          title: props.data.keyIndicators[1].title,
          data: props.data.keyIndicators[1].lensData.find(
            (d) => d.type === "map"
          ),
        },
      });
      setTopic(props.data.title);
      setLensData(getLensData(props)); // Update lens data on prop change
    }
  }, [props.data.keyIndicators, props.data.title]); // Track relevant changes in dependencies

  const showCitationsHandler = () => setCitations(true);
  const hideCitationsHandler = () => setCitations(false);

  const openTopicSelect = () => setShowTopicSelect(true);

  const handleTopicChange = (title) => {
    props.onTopicChange && props.onTopicChange(title, props.position);
    setShowTopicSelect(false);
  };

  const handleKeyIndicatorClick = (data, type) => {
    const alreadySelected =
      selectedIndicator[type] && selectedIndicator[type].title === data.title;
    let newData;

    if (alreadySelected) {
      newData = null;
    } else {
      newData = {
        title: data.title,
        data: data.lensData.find((d) => d.type === "map"),
      };
    }

    setSelectedIndicator({
      ...selectedIndicator,
      [type]: newData,
    });
  };

  const isSelected = (title) => {
    if (
      selectedIndicator.color &&
      selectedIndicator.circle &&
      title === selectedIndicator.color.title &&
      title === selectedIndicator.circle.title
    ) {
      return "both";
    } else if (
      selectedIndicator.color &&
      title === selectedIndicator.color.title
    ) {
      return "color";
    } else if (
      selectedIndicator.circle &&
      title === selectedIndicator.circle.title
    ) {
      return "circle";
    } else {
      return null;
    }
  };

  const renderLongitudeLines = () => {
    let styles = {
      fill: "none",
      stroke: "white",
      strokeOpacity: "0.1",
    };
    return (
      <div className="map-topic__long-lines">
        <svg height="100%" width="100%" viewBox="0 0 4000 2000">
          <ellipse cx="2000" cy="1000" rx="2000" ry="1000" style={styles} />
          <ellipse cx="2000" cy="1000" rx="1650" ry="1000" style={styles} />
          <ellipse cx="2000" cy="1000" rx="1300" ry="1000" style={styles} />
          <ellipse cx="2000" cy="1000" rx="950" ry="1000" style={styles} />
          <ellipse cx="2000" cy="1000" rx="600" ry="1000" style={styles} />
          <ellipse cx="2000" cy="1000" rx="250" ry="1000" style={styles} />
        </svg>
      </div>
    );
  };

  const renderSupportingData = (type) => {
    if (selectedIndicator[type] && selectedIndicator[type].lensData) {
      return (
        <Lenses
          data={selectedIndicator[type].lensData}
          selectedKeyIndicator={selectedIndicator[type].title}
          bottom={true}
        />
      );
    }
  };

  const keyCitations = props.data.keyIndicators.map((d) => d.citations).flat();
  const illustrationPath = `${process.env.PUBLIC_URL}/illustrations/${props.data.illustration}`;

  return (
    <div className="map-topic">
      {renderLongitudeLines()}
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-3 map-topic__position-container">
            <h2 className="map-topic__title">{props.data.title}</h2>
            <img
              className="map-topic__illustration"
              src={illustrationPath}
              alt={`illustration representing ${props.data.title}`}
            />
            <div className="map-topic__choose-topic">
              <button
                className="button button--outline"
                onClick={openTopicSelect}
              >
                <div>Choose Topic</div>
                <ButtonShape />
              </button>
            </div>
            <div className="map-topic__indicators map-topic__indicators--color">
              <p className="map-topic__indicators__label">Map data</p>
              {props.data.keyIndicators.map((indicatorData) => (
                <KeyIndicator
                  key={indicatorData.id}
                  data={indicatorData}
                  displayTitle={true}
                  mapButtons={true}
                  selected={isSelected(indicatorData.title)}
                  onClick={handleKeyIndicatorClick}
                />
              ))}
              <div className="map-topic__indicators__bar" />
            </div>
            <div className="topic__citations-button">
              <button
                className="button button--transparent"
                onClick={showCitationsHandler}
              >
                <IconBook className="icon" />
              </button>
            </div>
          </div>
          <div className="col-7">
            <div className="map-topic__map h-100">
              <USMap
                colorData={
                  selectedIndicator.color ? selectedIndicator.color.data : null
                }
                circleData={
                  selectedIndicator.circle
                    ? selectedIndicator.circle.data
                    : null
                }
              />
            </div>
          </div>
          <div className="col-2">
            <div className="map-topic__lenses">
              {lensData.map((d) => (
                <Lenses
                  key={d[0].id}
                  data={d}
                  selectedKeyIndicator={topic}
                  layout="map"
                  bottom={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {citations && (
        <div
          className="map-topic__citations-container back"
          onClick={hideCitationsHandler}
        >
          <div className="row h-100">
            <div className="col-12">
              <Citations data={keyCitations} />
            </div>
          </div>
        </div>
      )}
      {showTopicSelect && (
        <TopicSelect
          topics={props.allTopics}
          currentTopic={props.data.title}
          onTopicChange={handleTopicChange}
          bigWheel={true}
        />
      )}
    </div>
  );
};

export default MapTopic;
