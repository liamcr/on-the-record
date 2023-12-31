import React, { useEffect, useRef, useState } from "react";

import styles from "./ReviewScore.module.css";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";
import { useMediaQuery } from "@mui/material";

interface ReviewScoreProps {
  /**
   * True if the user is able to edit the value of the score, false otherwise
   */
  editable: boolean;
  /**
   * The (initial) score (out of 10) related to this review
   */
  score?: number;
  /**
   * A function that defines what the parent component should do
   * when the value of the review changes (only relevant if editable
   * is `true`)
   *
   * @param newValue The new score value (out of 10)
   * @returns
   */
  onChange?: (newValue: number) => any;
}

const buildForegroundClipPath = (score: number) => {
  let firstPoint = `${score * 10}% 100%`;
  let secondPoint = `${score * 10}% ${(10 - score) * 10}%`;

  return `polygon(${firstPoint}, ${secondPoint}, 0% 100%)`;
};

const ReviewScore: React.FC<ReviewScoreProps> = ({
  editable,
  score = 0,
  onChange,
}) => {
  const [selectedScore, setSelectedScore] = useState(score);
  const [displayedScore, setDisplayedScore] = useState(score);

  const isMobile = useMediaQuery("(max-width: 770px)");
  const reviewMeterRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: MouseEvent) => {
    if (reviewMeterRef && reviewMeterRef.current) {
      let reviewMeterWidth =
        reviewMeterRef.current.getBoundingClientRect().width;
      let reviewStartingX = reviewMeterRef.current.getBoundingClientRect().x;

      let newScore = Math.ceil(
        ((event.pageX - reviewStartingX) * 10) / reviewMeterWidth
      );
      setDisplayedScore(newScore);

      console.log(isMobile);
      if (isMobile) {
        setSelectedScore(newScore);

        if (onChange) onChange(newScore);
      }
    }
  };

  const onMouseOver: React.MouseEventHandler<HTMLDivElement> = () => {
    if (reviewMeterRef && reviewMeterRef.current) {
      reviewMeterRef.current.addEventListener("mousemove", onMouseMove);
    }
  };

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setSelectedScore(displayedScore);

    if (onChange) onChange(displayedScore);
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
        onClick={editable && !isMobile ? onClick : () => {}}
      >
        <div className={styles.neutralBackground} />
        <div
          className={styles.colouredForeground}
          style={{
            clipPath: buildForegroundClipPath(displayedScore),
          }}
        />
      </div>
      <div
        className={styles.scoreContainer}
        style={{
          marginLeft: editable ? "0" : "5%",
        }}
      >
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
