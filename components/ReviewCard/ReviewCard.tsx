import React, { useEffect, useMemo, useRef, useState } from "react";
import { Review } from "../../common/types";
import Image from "next/image";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";
import Link from "next/link";

import styles from "./ReviewCard.module.css";
import ReviewScore from "../ReviewScore/ReviewScore";
import { body } from "../../common/fonts";
import { entityTypeStrings } from "@/common/consts";

const ReviewCard: React.FC<Review> = ({
  author,
  score,
  src,
  subtitle,
  title,
  type,
  colour,
  review,
}) => {
  const reviewRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const onShowClick = () => {
    setExpanded((oldVal) => !oldVal);
  };

  useEffect(() => {
    const el = reviewRef.current;
    if (el !== null && el.offsetHeight < el.scrollHeight) {
      setIsOverflowing(true);
    }
  }, []);

  return (
    <div
      className={styles.reviewCard}
      style={{
        background: `linear-gradient(180deg, ${colour} 0%, rgba(var(--card-background-rgba)) 100%)`,
      }}
    >
      <Link
        href={`/profile/${author.provider}/${author.providerId}`}
        className={styles.postProfileIconLink}
      >
        <div className={styles.postProfileIconContainer}>
          <Image
            src={author.profilePictureSrc}
            alt={`${author.name}'s profile picture`}
            fill
            className={styles.postProfileIcon}
          />
        </div>
      </Link>
      <div className={styles.reviewHeader}>
        <div className={styles.coverArtSection}>
          <div className={styles.imageContainer}>
            <Image
              src={src}
              alt={`${title} cover art`}
              fill
              style={{ aspectRatio: 1 }}
              className={styles.coverArt}
            />
          </div>
        </div>
        <div className={styles.reviewInfo}>
          <div className={styles.titlesContainer}>
            <Heading
              component="h3"
              content={title}
              className={styles.reviewTitle}
            />
            <Body
              content={`${entityTypeStrings[type]} • ${subtitle}`}
              className={styles.reviewSubtitle}
            />
          </div>
          <ReviewScore editable={false} score={score} />
        </div>
      </div>
      {review && (
        <>
          <Heading
            component="h4"
            content="Review"
            className={styles.reviewTextHeader}
          />
          <Body
            className={`${styles.reviewBody} ${
              expanded ? "" : styles.reviewBodyCollapsed
            }`}
            content={review}
            ref={reviewRef}
          />
          {isOverflowing && (
            <div className={styles.showButtonContainer}>
              <p
                className={`${body.className} ${styles.showButton}`}
                onClick={onShowClick}
              >
                {expanded ? "Show less" : "Show more"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
