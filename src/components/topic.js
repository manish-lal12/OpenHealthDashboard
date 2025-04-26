import React, { useState, useEffect } from "react";
import KeyIndicator from "./key-indicator";
import SupportingIndicatorGroup from "./supporting-indicator-group";
import Lenses from "./lenses";
import TopicSelect from "./topic-select";
import ScrollContainer from "./scroll-container";
import Citations from "./citations";
import { ReactComponent as IconBook } from "../images/icons/book.svg";
import { ReactComponent as ButtonShape } from "../images/round_button.svg";

const Topic = ({
  data,
  allTopics,
  onTopicChange,
  alternateColoring,
  position,
}) => {
  const [selectedKeyIndicator, setSelectedKeyIndicator] = useState(
    data.keyIndicators[0]
  );
  const [citations, setCitations] = useState(false);
  const [showTopicSelect, setShowTopicSelect] = useState(false);

  useEffect(() => {
    setSelectedKeyIndicator(data.keyIndicators[0]);
  }, [data.keyIndicators]);

  const handleKeyIndicatorClick = (indicator) => {
    setSelectedKeyIndicator(indicator);
  };

  const openTopicSelect = () => {
    setShowTopicSelect(true);
  };

  const handleTopicChange = (title) => {
    onTopicChange && onTopicChange(title, position);
    setShowTopicSelect(false);
  };

  const showCitations = () => {
    setCitations(true);
  };

  const hideCitations = () => {
    setCitations(false);
  };

  const keyCitations = data.keyIndicators.map((d) => d.citations).flat();
  const supportingCitations = data.supportingIndicators
    .map((d) => d.citations)
    .flat();
  const allCitations = [...new Set([...keyCitations, ...supportingCitations])];

  const illustrationPath = data.illustration
    ? `${process.env.PUBLIC_URL}/illustrations/${data.illustration}`
    : null;

  return (
    <div className="topic-container h-100">
      <div
        className={`topic pad-all h-100 ${citations ? "blur" : ""} ${
          showTopicSelect ? "blur" : ""
        }`}
      >
        <div
          className={`topic__top-border ${
            alternateColoring ? "alternate" : ""
          }`}
        >
          <div className="container">
            <div className="row">
              <div className="col-6 border--right">
                <div className="pad-top pad-right">
                  <h2 className="topic__title">{data.title}</h2>
                  {illustrationPath && (
                    <img
                      className="topic__illustration"
                      src={illustrationPath}
                      alt={`illustration representing ${data.title}`}
                    />
                  )}
                  <div className="topic__choose-topic">
                    <button
                      className="button button--outline"
                      onClick={openTopicSelect}
                    >
                      <div>Choose Topic</div>
                      <ButtonShape />
                    </button>
                  </div>
                  <div className="topic__key-indicator-holder">
                    {data.keyIndicators.slice(0, 2).map((indicator) => (
                      <KeyIndicator
                        key={indicator.id}
                        data={indicator}
                        selected={
                          indicator.title === selectedKeyIndicator.title
                        }
                        onClick={handleKeyIndicatorClick}
                      />
                    ))}
                    <div className="key-indicator-lenses">
                      <Lenses
                        name={`${data.title}${selectedKeyIndicator.title}`}
                        data={selectedKeyIndicator.lensData}
                        selectedKeyIndicator={selectedKeyIndicator.title}
                      />
                    </div>
                  </div>
                  <div className="topic__citations-button">
                    <button
                      className="button button--transparent"
                      onClick={showCitations}
                    >
                      <IconBook className="icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <ScrollContainer for={data.title}>
                  <div
                    className={`scroll-container__content ${
                      alternateColoring ? "alternate" : ""
                    }`}
                  >
                    {data.keyIndicators.length > 2 &&
                      data.keyIndicators.slice(2).map((indicator) => (
                        <SupportingIndicatorGroup
                          key={indicator.id}
                          data={{
                            title: indicator.title,
                            indicators: [
                              indicator,
                              indicator.lensData.filter(
                                (d) => d.type !== "map"
                              ),
                            ].flat(),
                          }}
                        />
                      ))}
                    {data.supportingIndicators.map((indicatorGroup, index) => {
                      const last =
                        index === data.supportingIndicators.length - 1;
                      return indicatorGroup.hide === true ? null : (
                        <SupportingIndicatorGroup
                          key={indicatorGroup.id}
                          lastOne={last}
                          data={indicatorGroup}
                        />
                      );
                    })}
                  </div>
                </ScrollContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {citations && (
        <div
          className="container topic__citations-container h-100"
          onClick={hideCitations}
        >
          <div className="row h-100">
            <div className="col-12">
              <Citations data={allCitations} />
            </div>
          </div>
        </div>
      )}

      {showTopicSelect && (
        <TopicSelect
          topics={allTopics}
          currentTopic={data.title}
          onTopicChange={handleTopicChange}
        />
      )}
    </div>
  );
};

export default Topic;
