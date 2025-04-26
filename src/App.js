import React, { useState } from "react";

import Topic from "./components/topic";
import MapTopic from "./components/map-topic";
import Header from "./components/header";
import StorySelect from "./components/story-select";

import { ReactComponent as Squares } from "./images/squares.svg";

import maternalAndInfantMortalityData from "./data/build/maternal-and-infant-mortality.json";
import mentalHealth from "./data/build/mental-health.json";
import efficiencyAndCost from "./data/build/efficiency-and-cost.json";
import opioidEpidemic from "./data/build/opioid-epidemic.json";
import nutritionAndObesity from "./data/build/nutrition-and-obesity.json";
import substanceUseDisorder from "./data/build/substance-use-disorder.json";

const topics = [
  maternalAndInfantMortalityData,
  mentalHealth,
  efficiencyAndCost,
  opioidEpidemic,
  nutritionAndObesity,
  substanceUseDisorder,
];

const stories = [
  {
    id: "2",
    title: "Future Story",
    tagline: "Contribute with your data story!",
    description:
      "For Dashboard v1, we present the summary story The State of Health, USA. Contribute with your data story!",
    topics: [
      maternalAndInfantMortalityData,
      mentalHealth,
      substanceUseDisorder,
      opioidEpidemic,
      efficiencyAndCost,
    ],
  },
  {
    id: "stateOfHealthUSA",
    title: "The State of U.S. Health",
    tagline: "How are we doing as a nation? What are the biggest problems?",
    description: "How are we doing as a nation? What are the biggest problems?",
    topics: [
      maternalAndInfantMortalityData,
      mentalHealth,
      substanceUseDisorder,
      opioidEpidemic,
      efficiencyAndCost,
    ],
  },
  {
    id: "3",
    title: "Another Future Story",
    tagline: "Contribute with your data story!",
    description:
      "For Dashboard v1, we present the summary story The State of Health, USA. Contribute with your data story!",
    topics: [
      maternalAndInfantMortalityData,
      mentalHealth,
      substanceUseDisorder,
      opioidEpidemic,
      efficiencyAndCost,
    ],
  },
];

const mappedTopics = new Map(topics.map((topic) => [topic.title, topic]));

const App = () => {
  const [story, setStory] = useState(stories[1]); // Default to "The State of U.S. Health" story
  const [showStorySelect, setShowStorySelect] = useState(false);

  // Handle topic changes, updating the story's topics
  const handleTopicChange = (title, index) => {
    const updatedStory = { ...story }; // Use shallow copy of story
    updatedStory.topics[index] = mappedTopics.get(title); // Update the topic
    setStory(updatedStory); // Update the state
  };

  // Toggle the visibility of the story select modal
  const toggleStorySelect = () => {
    setShowStorySelect((prevState) => !prevState);
  };

  // Handle story selection from the story select modal
  const handleStorySelect = (selectedStory) => {
    if (!selectedStory) {
      toggleStorySelect();
    } else {
      setStory({
        ...selectedStory,
        topics: selectedStory.topics,
      });
      setShowStorySelect(false);
    }
  };

  // Render topics based on their indices
  const renderTopics = (indices) => {
    return indices.map((index) => {
      const currentTopic = story.topics[index];
      return (
        <div className="col-2" key={currentTopic.id}>
          <Topic
            position={index}
            alternateColoring={index === 0 || index === 4}
            data={currentTopic}
            allTopics={topics}
            onTopicChange={handleTopicChange}
          />
        </div>
      );
    });
  };

  return (
    <div className="app">
      <div className={`container ${showStorySelect ? "blur" : ""}`}>
        <div className="row screen-height">
          {renderTopics([0, 1])}
          <div className="col-4">
            <div className="center-container background--gradient-light">
              <Header story={story} onChooseStory={toggleStorySelect} />
              <MapTopic
                position={2}
                data={story.topics[2]}
                allTopics={topics}
                onTopicChange={handleTopicChange}
              />
            </div>
          </div>
          {renderTopics([3, 4])}
        </div>
      </div>

      {showStorySelect && (
        <div className="story-select-container">
          <div className="container">
            <div className="row screen-height">
              <div className="col-4"></div>
              <div className="col-4">
                <Squares className="story-select-container__squares" />
                <StorySelect
                  stories={stories}
                  selectedStory={story}
                  onStorySelect={handleStorySelect}
                />
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
