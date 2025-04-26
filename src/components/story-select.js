import React, { useRef } from "react";
import Slider from "react-slick";
import { ReactComponent as IconChevrons } from "../images/icons/chevrons.svg";

const StorySelect = ({ stories, selectedStory, onStorySelect }) => {
  const sliderRef = useRef(null);

  const prev = () => {
    sliderRef.current.slickPrev();
  };

  const next = () => {
    sliderRef.current.slickNext();
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="story-select">
      <button
        className="button button--transparent button--blue button--center story-select__button-prev"
        onClick={prev}
      >
        <IconChevrons className="icon icon--blue rotate--90" />
      </button>
      <div className="story-select__slider">
        <Slider {...settings} ref={sliderRef}>
          {stories.map((story) => (
            <div
              key={story.id}
              className={`story-select__story pad-vertical pad-horizontal--double ${
                story.id === selectedStory.id
                  ? "story-select__story--selected"
                  : ""
              }`}
            >
              <h2 className="margin-top--none text--uppercase">
                {story.title}
              </h2>
              <p>{story.description}</p>
              <ul className="list--no-style">
                {story.topics.map((topic) => (
                  <li key={topic.id}>{topic.title}</li>
                ))}
              </ul>
              <div className="margin-top--double">
                {story.id === selectedStory.id ? (
                  <button
                    className="button button--inverse button--large text--uppercase"
                    onClick={() => onStorySelect()}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    className="button button--blue button--large text--uppercase"
                    onClick={() => onStorySelect(story)}
                  >
                    Select Story
                  </button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <button
        className="button button--transparent button--blue button--center story-select__button-next"
        onClick={next}
      >
        <IconChevrons className="icon icon--blue rotate--270" />
      </button>
    </div>
  );
};

export default StorySelect;
