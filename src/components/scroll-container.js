import React, { useState, useEffect, useRef } from "react";
import { scroller } from "react-scroll";
import { ReactComponent as IconChevrons } from "../images/icons/chevrons.svg";

const ScrollContainer = (props) => {
  const [scrolled, setScrolled] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const container = useRef(null);
  const scrollArea = useRef(null);

  // Ref to track previous props
  const prevProps = useRef(props);

  // Check if scrolling is needed based on content height
  const needsScrollCheck = () => {
    if (container.current && scrollArea.current) {
      return scrollArea.current.clientHeight > container.current.clientHeight;
    }
    return false;
  };

  // Effect to check if scroll is needed when content is rendered
  useEffect(() => {
    setNeedsScroll(needsScrollCheck());
  }, [props.children]); // Re-run when children props change

  // Handle scrolling toggle using react-scroll
  const toggleScroll = () => {
    if (scrolled) {
      // Scroll back to the top of the container
      scroller.scrollTo("scrollTop", {
        duration: 500,
        smooth: true,
        offset: -70, // Adjust this value for your header height if needed
      });
    } else {
      // Scroll to the bottom of the container
      scroller.scrollTo("scrollBottom", {
        duration: 500,
        smooth: true,
        offset: -70, // Adjust this value for your header height if needed
      });
    }
    setScrolled(!scrolled);
  };

  // Update scroll state on prop change
  useEffect(() => {
    if (props.for !== prevProps.current.for) {
      setScrolled(false);
      setNeedsScroll(needsScrollCheck());
      scroller.scrollTo("scrollTop", {
        duration: 500,
        smooth: true,
      });
    }
    // Update the ref with current props
    prevProps.current = props;
  }, [props.for]); // Dependency on props.for to compare when it changes

  return (
    <div
      className={`scroll-container ${
        needsScroll ? "scroll-container--needs-scroll" : ""
      } ${scrolled ? "scroll-container--scrolled" : ""}`}
      ref={container}
    >
      <div id="scrollTop" />
      <div id="scrollBottom" />

      {needsScroll && (
        <button
          className="button button--yellow button--large button--center scroll-container__up"
          onClick={toggleScroll}
        >
          <IconChevrons className="icon icon--blue rotate--180" />
        </button>
      )}
      <div ref={scrollArea}>{props.children}</div>
      {needsScroll && (
        <button
          className="button button--yellow button--large button--center scroll-container__down"
          onClick={toggleScroll}
        >
          <IconChevrons className="icon icon--blue" />
        </button>
      )}
    </div>
  );
};

export default ScrollContainer;
