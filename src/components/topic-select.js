import React, { useState, useRef } from "react";
import { ReactComponent as IconChevrons } from "../images/icons/chevrons.svg";
import { ReactComponent as Wheels } from "../images/wheels.svg";
import { ReactComponent as Line } from "../images/topic_line.svg";
import { ReactComponent as BigWheels } from "../images/big-wheels.svg";
import { ReactComponent as BigLine } from "../images/big-zigzag.svg";

const TopicSelect = ({ topics, currentTopic, onTopicChange, bigWheel }) => {
  const [currentIndex, setCurrentIndex] = useState(
    topics.map((t) => t.title).indexOf(currentTopic)
  );
  const container = useRef(null);

  const incrementTopic = (direction) => {
    const nextIndex = direction === "up" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex === topics.length) {
      setCurrentIndex(0);
    } else if (nextIndex < 0) {
      setCurrentIndex(topics.length - 1);
    } else {
      moveToTopic(nextIndex);
    }
  };

  const moveToTopic = (i) => {
    setCurrentIndex(i);
  };

  const pickTopic = (title) => {
    onTopicChange && onTopicChange(title);
  };

  const translateOption = (i) => {
    const width = 1920;
    const height = 1920;
    const radius = 2575;
    const step = (2 * Math.PI) / 80;
    const angle = step * (currentIndex - i);

    const x = Math.round(width / 2 + radius * Math.cos(angle));
    const y = Math.round(height / 2 + radius * Math.sin(angle));

    return `translate(${x}px, ${y}px)`;
  };

  const focusedTopic = topics[currentIndex];
  const originalTopic = currentTopic;

  return (
    <div className="topic-select" ref={container}>
      {bigWheel ? (
        <BigWheels className="topic-select__wheel topic-select__wheel--big" />
      ) : (
        <Wheels className="topic-select__wheel" />
      )}
      <div className="topic-select__content">
        <div
          className={`topic-select__dismiss ${
            bigWheel ? "topic-select__dismiss--big" : ""
          }`}
          onClick={() => pickTopic(originalTopic)}
        />
        <button
          className="button button--blue button--large button--center topic-select__button-up"
          onClick={() => incrementTopic("up")}
        >
          <IconChevrons className="icon rotate--180" />
        </button>
        {bigWheel ? (
          <BigLine className="topic-select__zigline topic-select__zigline--big" />
        ) : (
          <Line className="topic-select__zigline" />
        )}
        <ul
          className="topic-select__options"
          style={{ transform: "translate(-3300px, -50px)" }}
        >
          {topics.map((topic, i) => (
            <li
              key={topic.id}
              className={`topic-select__option ${
                i === currentIndex ? "selected" : ""
              }`}
              style={{ transform: translateOption(i) }}
              onClick={() => moveToTopic(i)}
            >
              <span className="text--uppercase">{topic.title}</span>
            </li>
          ))}
        </ul>
        <button
          className="button button--blue button--large button--center topic-select__button-down"
          onClick={() => incrementTopic("down")}
        >
          <IconChevrons className="icon" />
        </button>
        <div
          className={`topic-select__description ${
            bigWheel ? "topic-select__description--big" : ""
          }`}
        >
          <p>{focusedTopic.description}</p>
          <div className="text--center">
            {focusedTopic.title === currentTopic ? (
              <button
                className="button button--inverse button--large text--uppercase"
                onClick={() => pickTopic(originalTopic)}
              >
                Back
              </button>
            ) : (
              <button
                className="button button--blue button--large text--uppercase"
                onClick={() => pickTopic(focusedTopic.title)}
              >
                Open
              </button>
            )}
          </div>
        </div>
        <div className="topic-select__dismiss-text">
          Return to {currentTopic}
        </div>
      </div>
    </div>
  );
};

export default TopicSelect;
