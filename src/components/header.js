import React from "react";
import { ReactComponent as ButtonShape } from "../images/story_button.svg";

const Header = ({ story, onChooseStory }) => {
  return (
    <div className="header">
      <h2 className="header__story-title">{story.title}</h2>
      <p className="header__story-tag">{story.tagline}</p>
      <button className="button button--outline" onClick={onChooseStory}>
        <div>Choose Story</div>
        <ButtonShape />
      </button>
    </div>
  );
};

export default Header;
