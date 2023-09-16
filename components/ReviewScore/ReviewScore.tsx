import React, { useEffect, useRef, useState } from "react";

import styles from "./ReviewScore.module.css";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";

// TODO: Add an 'onchange' function prop so parents can do something with
// value
interface ReviewScoreProps {
  editable: boolean;
  score?: number;
}

const buildForegroundClipPath = (score: number) => {
  let firstPoint = `${score * 10}% 100%`;
  let secondPoint = `${score * 10}% ${(10 - score) * 10}%`;

  return `polygon(${firstPoint}, ${secondPoint}, 100% 0%, 100% 100%)`;
};

const ReviewScore: React.FC<ReviewScoreProps> = ({ editable, score = 0 }) => {
  const [selectedScore, setSelectedScore] = useState(score);
  const [displayedScore, setDisplayedScore] = useState(score);
  const reviewMeterRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: MouseEvent) => {
    if (reviewMeterRef && reviewMeterRef.current) {
      let reviewMeterWidth =
        reviewMeterRef.current.getBoundingClientRect().width;
      let reviewStartingX = reviewMeterRef.current.getBoundingClientRect().x;

      setDisplayedScore(
        Math.ceil(((event.pageX - reviewStartingX) * 10) / reviewMeterWidth)
      );
    }
  };

  const onMouseOver: React.MouseEventHandler<HTMLDivElement> = () => {
    if (reviewMeterRef && reviewMeterRef.current) {
      reviewMeterRef.current.addEventListener("mousemove", onMouseMove);
    }
  };

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setSelectedScore(displayedScore);
  };

  const onMouseExit: React.MouseEventHandler<HTMLDivElement> = () => {
    if (reviewMeterRef && reviewMeterRef.current) {
      reviewMeterRef.current.removeEventListener("mousemove", onMouseMove);
    }
    setDisplayedScore(selectedScore);
  };

  return (
    <div
      className={styles.reviewScoreContainer}
      style={{
        flexDirection: editable ? "column" : "row",
      }}
    >
      <div
        className={styles.reviewMeterContainer}
        ref={reviewMeterRef}
        onMouseEnter={editable ? onMouseOver : () => {}}
        onMouseLeave={editable ? onMouseExit : () => {}}
        onMouseDown={editable ? onClick : () => {}}
      >
        <div className={styles.colouredBackground} />
        <div
          className={styles.neutralForeground}
          style={{
            clipPath: buildForegroundClipPath(displayedScore),
          }}
        />
      </div>
      <div className={styles.scoreContainer}>
        <Heading
          component="h3"
          content={`${displayedScore ? displayedScore : "?"}`}
        />
        <Body content="/10" className={styles.outOfTen} />
      </div>
    </div>
  );
};

export default ReviewScore;
