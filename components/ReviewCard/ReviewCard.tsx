import { Review } from "../../common/types";
import React, { useState, useMemo } from "react";
import PostProfileIcon from "../PostProfileIcon/PostProfileIcon";
import Image from "next/image";

import styles from "./ReviewCard.module.css";
import Heading from "../Heading/Heading";
import Body from "../Body/Body";
import Link from "next/link";

// TODO: Make this CSS variable that works for light/dark modes?
const cardDefaultColour = "rgba(128, 128, 128, 0.10)";

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
  const [dominantColor, setDominantColor] = useState(
    "rgba(200, 200, 200, 0.80)"
  );

  const background = useMemo(() => {
    return `linear-gradient(180deg, ${dominantColor} 0%, ${cardDefaultColour} 100%)`;
  }, [dominantColor]);

  console.log(background);

  return (
    <div
      className={styles.reviewCard}
      style={{
        background,
      }}
    >
      <Link
        href={`/profile/${author.id}`}
        className={styles.postProfileIconContainer}
      >
        <Image
          src={author.profilePictureSrc}
          alt={`${author.name}'s profile picture`}
          width={100}
          height={100}
          className={styles.postProfileIcon}
        ></Image>
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
            <Heading component="h3" content={title} />
            <Body content={subtitle} className={styles.reviewSubtitle} />
          </div>
          <div className={styles.scoreContainer}>
            <Heading component="h3" content={`${score}`} />
            <Body className={styles.scoreSubtitle} content="/10" />
          </div>
        </div>
      </div>
      {review && (
        <>
          <Heading component="h4" content="Review" />
          <Body className={styles.scoreSubtitle} content={review} />
        </>
      )}
    </div>
  );
};

export default ReviewCard;
